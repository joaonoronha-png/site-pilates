// Gera as Perguntas Frequentes do index.html a partir de data/knowledge-base.js
// (HTML entre <!--FAQ:START--> e <!--FAQ:END--> + bloco FAQPage do JSON-LD).
// Uso: node tools/build-faq.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url).pathname;
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(root + 'data/knowledge-base.js', 'utf8'), sandbox);
const KB = sandbox.window.RS_KB;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const topic = (id) => KB.topics.find((t) => t.id === id);

const items = KB.faq.map((f) => {
  const tp = f.topic ? topic(f.topic) : null;
  if (f.topic && !tp) throw new Error('Tópico inexistente no FAQ: ' + f.topic);
  const status = tp ? tp.status : f.status;
  const answer = status === 'nao_confirmado'
    ? KB.messages.faqUnconfirmed
    : (tp ? (tp.faqAnswer || tp.answer) : f.answer);
  return { q: f.q, a: answer, confirmed: status !== 'nao_confirmado', topic: f.topic || '' };
});

const html = items.map((it) => {
  const extra = it.confirmed ? '' :
    ` <button class="faq__ask" type="button" data-chat-open data-chat-context="faq_item" data-chat-ask="${esc(it.q)}">Perguntar à equipe</button>`;
  return `            <details${it.confirmed ? '' : ' data-pending'}>
              <summary>${esc(it.q)}</summary>
              <p>${esc(it.a)}${extra}</p>
            </details>`;
}).join('\n');

let page = readFileSync(root + 'index.html', 'utf8');
page = page.replace(/<!--FAQ:START-->[\s\S]*?<!--FAQ:END-->/, `<!--FAQ:START-->\n${html}\n<!--FAQ:END-->`);

// JSON-LD: só perguntas com resposta confirmada
page = page.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (m, a, json, c) => {
  const data = JSON.parse(json);
  const faq = {
    '@type': 'FAQPage',
    mainEntity: items.filter((i) => i.confirmed).map((i) => ({
      '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a }
    }))
  };
  data['@graph'] = data['@graph'].filter((n) => n['@type'] !== 'FAQPage').concat([faq]);
  return a + '\n  ' + JSON.stringify(data, null, 2).replace(/\n/g, '\n  ') + '\n  ' + c;
});

writeFileSync(root + 'index.html', page);
console.log(`FAQ atualizado: ${items.length} perguntas (${items.filter((i) => i.confirmed).length} com resposta confirmada).`);
