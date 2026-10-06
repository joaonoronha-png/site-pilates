/* Medição de conversão — LGPD friendly.
   Todos os eventos vão para window.dataLayer. Ferramentas externas (GA4/GTM)
   só são carregadas se configuradas em data/config.js E com consentimento. */
(function () {
  'use strict';
  var cfg = window.RS_CONFIG || {};
  var CONSENT_KEY = 'rs_consent';
  window.dataLayer = window.dataLayer || [];

  function store(get, val) {
    try {
      if (get) return localStorage.getItem(CONSENT_KEY);
      localStorage.setItem(CONSENT_KEY, val);
    } catch (e) { return null; }
  }

  function track(event, params) {
    var payload = Object.assign({ event: event }, params || {});
    window.dataLayer.push(payload);
    if (typeof window.gtag === 'function') window.gtag('event', event, params || {});
    if (cfg.debugAnalytics && window.console) console.info('[rs:track]', payload);
  }
  window.rsTrack = track;

  function loadTools() {
    if (cfg.ga4Id) {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4Id);
      document.head.appendChild(s);
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', cfg.ga4Id, { anonymize_ip: true });
    }
    if (cfg.gtmId) {
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      var g = document.createElement('script');
      g.async = true;
      g.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(cfg.gtmId);
      document.head.appendChild(g);
    }
  }

  function initConsent() {
    if (!cfg.ga4Id && !cfg.gtmId) return; // nada a carregar → nenhum aviso
    var choice = store(true);
    if (choice === 'granted') return loadTools();
    if (choice === 'denied') return;
    var bar = document.querySelector('[data-consent]');
    if (!bar) return;
    bar.hidden = false;
    bar.querySelector('[data-consent-accept]').addEventListener('click', function () {
      store(false, 'granted'); bar.hidden = true; loadTools();
    });
    bar.querySelector('[data-consent-deny]').addEventListener('click', function () {
      store(false, 'denied'); bar.hidden = true;
    });
  }

  // Cliques declarativos: data-track="nome_evento" data-track-label="..."
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (!el) return;
    track(el.getAttribute('data-track'), { label: el.getAttribute('data-track-label') || undefined });
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initConsent);
  else initConsent();
})();
