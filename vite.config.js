import { defineConfig, loadEnv } from 'vite';
import { resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Pré-renderiza cada página no build (e no dev): o HTML final já chega com
 * todo o conteúdo — bom para SEO, acessibilidade e primeira pintura. O JS
 * apenas adiciona as interações.
 *
 * Variáveis de ambiente:
 *   SITE_URL                 domínio público (ex.: https://www.exemplo.com.br) — ativa canonical, OG e sitemap
 *   VITE_ASSISTANT_ENDPOINT  rota do backend de IA (ex.: /api/assistant) — sem ela o assistente usa só a base local
 */
function prerender(env) {
  const siteUrl = (env.SITE_URL || '').replace(/\/$/, '');
  const aiRemote = Boolean(env.VITE_ASSISTANT_ENDPOINT);
  let server;
  const load = async () =>
    server
      ? server.ssrLoadModule('/src/pages.js')
      : import(`${pathToFileURL(resolve('src/pages.js')).href}?t=${Date.now()}`);

  return {
    name: 'bcm-prerender',
    configureServer(s) {
      server = s;
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(html, ctx) {
        const { PAGES, renderPage } = await load();
        const key = relative(resolve('.'), ctx.filename).replace(/\\/g, '/');
        const page = PAGES[key];
        if (!page) return html;
        const { head, body } = renderPage(page, { siteUrl, aiRemote });
        return html.replace('<!--head-->', head).replace('<!--app-->', body);
      },
    },
    async generateBundle() {
      const { PAGES } = await load();
      const sitemapLine = siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml` : '';
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n${sitemapLine}\n` });
      if (siteUrl) {
        const today = new Date().toISOString().slice(0, 10);
        const urls = Object.values(PAGES)
          .map((p) => `  <url><loc>${siteUrl}${p.path}</loc><lastmod>${today}</lastmod></url>`)
          .join('\n');
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        });
      } else {
        this.warn('SITE_URL não definido: sitemap.xml, canonical e og:url não foram gerados.');
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const pages = [
    'index.html',
    'dermatologia/index.html',
    'privacidade/index.html',
    'equipe/marina-bittencourt/index.html',
    'equipe/bruna-duque-estrada/index.html',
    'equipe/carla-tamler/index.html',
  ];
  return {
    plugins: [prerender(env)],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      rollupOptions: {
        input: Object.fromEntries(pages.map((p) => [p.replace(/\/?index\.html$/, '') || 'home', resolve(p)])),
      },
    },
  };
});
