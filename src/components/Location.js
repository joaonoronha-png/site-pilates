import { clinic, telLink, whatsappLink, doctors, fmtHour } from '../data/site.js';
import { esc, icon } from '../lib/html.js';

export function renderLocation() {
  const a = clinic.address;
  return `<section class="section location" id="contato" aria-labelledby="loc-title">
  <div class="container loc-grid">
    <div class="loc-info">
      <p class="eyebrow reveal">Contato e localização</p>
      <h2 id="loc-title" class="h2 reveal">Estamos aqui <em>para você.</em></h2>
      <address class="loc-list reveal-stagger">
        <div class="loc-row">${icon('pin')}<div><span class="loc-label">Endereço</span><p>${esc(a.street)}, ${esc(a.complement)}<br>${esc(a.district)}, ${esc(a.city)} — ${esc(a.state)} · CEP ${esc(a.postalCode)}</p></div></div>
        <div class="loc-row">${icon('phone')}<div><span class="loc-label">Telefone</span><p><a href="${telLink}">${esc(clinic.phone.display)}</a></p></div></div>
        <div class="loc-row">${icon('whatsapp')}<div><span class="loc-label">WhatsApp</span><p><a href="${whatsappLink()}" target="_blank" rel="noopener">${esc(clinic.whatsapp.display)}</a></p></div></div>
        <div class="loc-row">${icon('clock')}<div><span class="loc-label">Horário</span>
          <table class="hours" data-hours>
            <caption class="visually-hidden">Horário de funcionamento</caption>
            <tbody>${clinic.hours.map((h) => `<tr data-day="${h.schema}"><th scope="row">${h.day}</th><td>${fmtHour(h.opens)} – ${fmtHour(h.closes)}</td></tr>`).join('')}</tbody>
          </table>
          <p class="note">${esc(clinic.hoursNote)}</p>
        </div></div>
      </address>
      <div class="loc-ctas reveal">
        <a class="btn btn-primary magnetic" href="${whatsappLink()}" target="_blank" rel="noopener">${icon('whatsapp')}<span>Falar com a BCM</span></a>
        <a class="btn btn-ghost" href="${telLink}">${icon('phone')}<span>Ligar</span></a>
      </div>
    </div>
    <div class="loc-map reveal-clip">
      <div class="map-frame" data-map data-embed="${esc(clinic.maps.embed)}">
        <div class="map-placeholder">
          <svg class="map-art" viewBox="0 0 400 300" aria-hidden="true" focusable="false">
            <path d="M-10 210 C 90 170, 170 240, 410 150" class="map-road"/>
            <path d="M60 -10 C 90 120, 60 200, 120 310" class="map-road thin"/>
            <path d="M260 -10 C 240 100, 300 180, 280 310" class="map-road thin"/>
            <path d="M-10 90 C 120 110, 260 70, 410 95" class="map-road thin"/>
            <circle cx="205" cy="186" r="34" class="map-pulse"/>
            <circle cx="205" cy="186" r="7" class="map-pin"/>
          </svg>
          <div class="map-cta">
            <p><strong>${esc(clinic.name)}</strong><br>${esc(a.street)} · ${esc(a.district)}</p>
            <button type="button" class="btn btn-sm btn-ghost" data-map-load>Carregar mapa interativo</button>
            <p class="note">O mapa é fornecido pelo Google e só é carregado se você clicar.</p>
          </div>
        </div>
      </div>
      <div class="map-actions">
        <a class="btn btn-dark" href="${clinic.maps.link}" target="_blank" rel="noopener">${icon('pin')}<span>Abrir no Google Maps</span>${icon('external', 'btn-arrow')}</a>
        <a class="btn btn-ghost" href="${clinic.maps.waze}" target="_blank" rel="noopener"><span>Abrir no Waze</span>${icon('external', 'btn-arrow')}</a>
      </div>
    </div>
  </div>
</section>`;
}

export function renderInstagram() {
  const d = doctors.find((x) => x.instagram);
  return `<section class="section instagram" id="instagram" aria-labelledby="ig-title">
  <div class="container"><div class="ig-card reveal">
    <div class="ig-icon" aria-hidden="true">${icon('instagram')}</div>
    <div class="ig-copy">
      <p class="eyebrow">Redes sociais</p>
      <h2 id="ig-title" class="h3">Acompanhe a BCM</h2>
      <p>Não localizamos um perfil institucional da BCM nas redes sociais. Enquanto isso, acompanhe o perfil profissional da ${esc(d.name)}, dermatologista e sócia da clínica.</p>
    </div>
    <a class="btn btn-ghost magnetic" href="https://www.instagram.com/${d.instagram}/" target="_blank" rel="noopener">${icon('instagram')}<span>Ver Instagram @${esc(d.instagram)}</span></a>
  </div></div>
</section>`;
}

