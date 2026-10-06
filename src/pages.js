/**
 * Composição das páginas + <head> (SEO). Executado em Node durante o build
 * (pré-renderização) — nada aqui pode depender de `window`.
 */
import { clinic, doctors, specialties } from './data/site.js';
import { faqs } from './data/faq.js';
import { esc } from './lib/html.js';
import { renderIntro, renderHeader } from './components/Header.js';
import { renderHero } from './components/Hero.js';
import { renderSearch } from './components/Search.js';
import { renderAbout } from './components/About.js';
import { renderSpecialties } from './components/Specialties.js';
import { renderServices } from './components/Services.js';
import { renderDoctors } from './components/Doctors.js';
import { renderDifferentials, renderExperience } from './components/Differentials.js';
import { renderGallery } from './components/Gallery.js';
import { renderFAQ } from './components/FAQ.js';
import { renderLocation, renderInstagram } from './components/Location.js';
import { renderCTA, renderFooter, renderAssistantLauncher } from './components/Footer.js';
import { renderDoctorProfile } from './components/DoctorProfile.js';
import { renderSpecialtyPage } from './components/SpecialtyPage.js';
import { renderPrivacyPage } from './components/PrivacyPage.js';

/** Lista de páginas: caminho do HTML de entrada → definição. */
export const PAGES = {
  'index.html': { type: 'home', path: '/' },
  'dermatologia/index.html': { type: 'specialty', slug: 'dermatologia', path: '/dermatologia/' },
  'privacidade/index.html': { type: 'privacy', path: '/privacidade/' },
  ...Object.fromEntries(doctors.map((d) => [`equipe/${d.slug}/index.html`, { type: 'doctor', slug: d.slug, path: `/equipe/${d.slug}/` }])),
};

const clinicSchema = (siteUrl) => ({
  '@context': 'https://schema.org',
  '@type': ['MedicalClinic', 'MedicalBusiness'],
  name: clinic.name,
  legalName: clinic.legalName,
  ...(siteUrl ? { url: siteUrl, '@id': `${siteUrl}/#clinica` } : {}),
  telephone: clinic.phone.e164,
  medicalSpecialty: 'Dermatology',
  foundingDate: clinic.foundedDate,
  taxID: clinic.cnpj,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${clinic.address.street}, ${clinic.address.complement}`,
    addressLocality: clinic.address.city,
    addressRegion: clinic.address.state,
    postalCode: clinic.address.postalCode,
    addressCountry: clinic.address.country,
  },
  areaServed: { '@type': 'City', name: 'Rio de Janeiro' },
  openingHoursSpecification: clinic.hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: `https://schema.org/${h.schema}`,
    opens: h.opens,
    closes: h.closes,
  })),
  hasMap: clinic.maps.link,
});

const physicianSchema = (d, siteUrl) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: d.fullName,
  alternateName: d.name,
  jobTitle: 'Dermatologista',
  hasCredential: d.registrations.map((r) => ({ '@type': 'EducationalOccupationalCredential', name: r })),
  ...(d.memberships.length ? { memberOf: d.memberships.map((m) => ({ '@type': 'Organization', name: m.replace(/^Membro (Titular )?d[ao] /, '') })) } : {}),
  ...(d.atBcmConfirmed || d.partner ? { worksFor: { '@type': 'MedicalClinic', name: clinic.name } } : {}),
  ...(siteUrl ? { url: `${siteUrl}/equipe/${d.slug}/` } : {}),
  ...(d.photo && siteUrl ? { image: `${siteUrl}${d.photo}` } : {}),
  sameAs: [d.website, d.instagram && `https://www.instagram.com/${d.instagram}/`].filter(Boolean),
});

const faqSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

function head({ title, description, path, siteUrl, schemas = [], ogImage = '/img/hero-1600.webp', preload }) {
  const url = siteUrl ? `${siteUrl}${path}` : null;
  const img = siteUrl ? `${siteUrl}${ogImage}` : null;
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#f5f1ea" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#121b19" media="(prefers-color-scheme: dark)">
${url ? `<link rel="canonical" href="${url}">` : ''}
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${esc(clinic.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
${url ? `<meta property="og:url" content="${url}">` : ''}
${img ? `<meta property="og:image" content="${img}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="geo.region" content="BR-RJ">
<meta name="geo.placename" content="${esc(clinic.address.district)}, ${esc(clinic.address.city)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/site.webmanifest">
${preload ? `<link rel="preload" as="image" type="image/avif" imagesrcset="/img/${preload}-800.avif 800w, /img/${preload}-1600.avif 1600w" imagesizes="(min-width: 960px) 46vw, 100vw" fetchpriority="high">` : ''}
<script>document.documentElement.classList.add('js');try{if(sessionStorage.getItem('bcm-intro'))document.documentElement.classList.add('intro-seen')}catch(e){}</script>
${schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, '\\u003c')}</script>`).join('\n')}`;
}

/** @returns {{ head: string, body: string }} */
export function renderPage(page, { siteUrl = '', aiRemote = false } = {}) {
  const footer = (home) => `${renderFooter({ home })}${renderAssistantLauncher()}`;

  if (page.type === 'home') {
    return {
      head: head({
        title: `${clinic.name} | Dermatologista na Barra da Tijuca, Rio de Janeiro`,
        description: `Clínica de dermatologia na Av. das Américas, 2480 — Barra da Tijuca, RJ. Dermatologistas com RQE. Agende pelo telefone ${clinic.phone.display} ou WhatsApp.`,
        path: page.path,
        siteUrl,
        preload: 'hero',
        schemas: [clinicSchema(siteUrl), faqSchema(faqs)],
      }),
      body: `${renderIntro()}${renderHeader({ home: true })}
<main id="conteudo">
${renderHero()}${renderSearch()}${renderAbout()}${renderSpecialties()}${renderServices()}${renderDoctors()}${renderDifferentials()}${renderExperience()}${renderGallery()}${renderFAQ()}${renderLocation()}${renderInstagram()}${renderCTA()}
</main>
${footer(true)}`,
    };
  }

  if (page.type === 'specialty') {
    const spec = specialties.find((s) => s.slug === page.slug);
    return {
      head: head({
        title: `${spec.name} na Barra da Tijuca | ${clinic.name}`,
        description: `${spec.description} Av. das Américas, 2480 — Barra da Tijuca, RJ.`,
        path: page.path,
        siteUrl,
        preload: spec.image,
        schemas: [
          {
            '@context': 'https://schema.org',
            '@type': 'MedicalWebPage',
            name: `${spec.name} — ${clinic.name}`,
            about: { '@type': 'MedicalSpecialty', name: 'Dermatology' },
            ...(siteUrl ? { url: `${siteUrl}${page.path}` } : {}),
          },
          clinicSchema(siteUrl),
        ],
      }),
      body: `${renderHeader()}${renderSpecialtyPage(spec)}${renderCTA({ title: 'Seu cuidado começa com uma escolha.', text: 'Agende sua consulta dermatológica na BCM.' })}${footer(false)}`,
    };
  }

  if (page.type === 'doctor') {
    const d = doctors.find((x) => x.slug === page.slug);
    return {
      head: head({
        title: `${d.name} — Dermatologista | ${clinic.name}`,
        description: `${d.name}, dermatologista (${d.registrations.join(', ')}). ${d.summary}`.slice(0, 300),
        path: page.path,
        siteUrl,
        ogImage: d.photo || undefined,
        schemas: [physicianSchema(d, siteUrl)],
      }),
      body: `${renderHeader()}${renderDoctorProfile(d)}${footer(false)}`,
    };
  }

  if (page.type === 'privacy') {
    return {
      head: head({
        title: `Política de privacidade | ${clinic.name}`,
        description: `Como o site da ${clinic.name} trata informações pessoais, conforme a LGPD.`,
        path: page.path,
        siteUrl,
      }),
      body: `${renderHeader()}${renderPrivacyPage({ aiRemote })}${footer(false)}`,
    };
  }
  throw new Error(`Página desconhecida: ${page.type}`);
}
