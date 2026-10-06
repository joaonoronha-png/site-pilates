/**
 * Interface do Assistente BCM. Carregada sob demanda (import dinâmico) na
 * primeira vez que alguém abre o assistente.
 *
 * Modo local (padrão): respostas do motor local, baseado nos dados oficiais.
 * Modo IA: se VITE_ASSISTANT_ENDPOINT estiver definido no build, perguntas
 * livres são enviadas ao backend (api/assistant.js). Regras de segurança
 * locais (emergência, agendamento guiado) continuam valendo antes da IA.
 */
import { clinic, telLink, whatsappLink } from '../data/site.js';
import { esc, icon, logoMark } from '../lib/html.js';
import { respond, DISCLAIMER, SUGGESTIONS, NOT_FOUND } from './engine.js';

const ENDPOINT = import.meta.env.VITE_ASSISTANT_ENDPOINT || '';
const STORE_KEY = 'bcm-assistant';
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let panel;
let log;
let input;
let launcher;
let state = {};
let history = []; // { role: 'user'|'assistant', text, actions?, note?, source? }
let busy = false;

const save = () => {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify({ history: history.slice(-30), state }));
  } catch {}
};
const restore = () => {
  try {
    const raw = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null');
    if (raw) ({ history, state } = raw);
  } catch {}
};

function actionHtml(a) {
  switch (a.type) {
    case 'whatsapp':
      return `<a class="as-action is-primary" href="${whatsappLink(a.text)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${esc(a.label)}</span></a>`;
    case 'phone':
      return `<a class="as-action" href="${telLink}">${icon('phone')}<span>${esc(a.label)}</span></a>`;
    case 'map':
      return `<a class="as-action" href="${clinic.maps.link}" target="_blank" rel="noopener">${icon('pin')}<span>${esc(a.label)}</span></a>`;
    case 'handoff':
      return `<a class="as-action is-primary" href="${whatsappLink('Olá! Tenho uma dúvida que o assistente do site não respondeu.')}" target="_blank" rel="noopener">${icon('user')}<span>${esc(a.label)}</span></a>`;
    case 'link':
      return `<a class="as-action" href="${esc(a.href)}"${a.href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${esc(a.label)}${icon('arrow')}</a>`;
    case 'choice':
      return `<button type="button" class="as-action is-choice" data-choice="${esc(a.value)}">${esc(a.label)}</button>`;
    default:
      return '';
  }
}

function messageHtml(m) {
  if (m.role === 'user') return `<div class="as-msg is-user"><p>${esc(m.text)}</p></div>`;
  return `<div class="as-msg is-bot">
    <span class="as-avatar" aria-hidden="true">${logoMark()}</span>
    <div class="as-bubble">
      <p>${esc(m.text).replace(/\n/g, '<br>')}</p>
      ${m.note ? `<p class="as-note">${esc(m.note)}</p>` : ''}
      ${m.actions?.length ? `<div class="as-actions">${m.actions.map(actionHtml).join('')}</div>` : ''}
      ${m.source ? `<p class="as-source">Fonte: ${esc(m.source)}</p>` : ''}
    </div>
  </div>`;
}

function renderLog() {
  log.innerHTML =
    messageHtml({
      role: 'assistant',
      text: `Olá! Sou o Assistente BCM. Posso ajudar com especialidades, equipe, horários, localização, contato e agendamento da ${clinic.name}.`,
    }) + history.map(messageHtml).join('');
  log.scrollTop = log.scrollHeight;
}

function append(m) {
  history.push(m);
  log.insertAdjacentHTML('beforeend', messageHtml(m));
  log.scrollTo({ top: log.scrollHeight, behavior: reduceMotion() ? 'auto' : 'smooth' });
  save();
}

function typing(on) {
  log.querySelector('.as-typing')?.remove();
  if (on) {
    log.insertAdjacentHTML('beforeend', '<div class="as-typing" aria-label="Assistente escrevendo"><span></span><span></span><span></span></div>');
    log.scrollTop = log.scrollHeight;
  }
}

async function askRemote(text) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [...history.filter((m) => m.text).slice(-8), { role: 'user', text }].map((m) => ({ role: m.role, content: m.text })),
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data?.text) throw new Error('Resposta vazia');
  return { text: data.text, actions: data.handoff ? [{ type: 'handoff', label: 'Falar com a equipe' }] : [], source: 'Assistente com IA · base oficial' };
}

async function send(value, label) {
  if (busy || !value.trim()) return;
  busy = true;
  append({ role: 'user', text: label || value });
  typing(true);
  const local = respond(value, state);
  let reply = local;
  // Perguntas livres que o motor local não resolveu vão para a IA, se configurada.
  if (ENDPOINT && !local.matched && !value.startsWith('booking:')) {
    try {
      reply = await askRemote(value);
    } catch {
      reply = { ...local, text: NOT_FOUND };
    }
  } else {
    await new Promise((r) => setTimeout(r, reduceMotion() ? 0 : 380));
  }
  state = local.state || {};
  typing(false);
  append({ role: 'assistant', text: reply.text, actions: reply.actions, note: reply.note, source: reply.source });
  busy = false;
}

function build() {
  restore();
  launcher = document.querySelector('.assistant-launcher');
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div class="assistant" id="assistant-panel" role="dialog" aria-modal="false" aria-labelledby="as-title" hidden>
      <header class="as-head">
        <span class="as-head-mark" aria-hidden="true">${logoMark()}</span>
        <div>
          <h2 id="as-title" class="as-title">Assistente BCM</h2>
          <p class="as-mode"><span class="as-dot" aria-hidden="true"></span>${ENDPOINT ? 'IA conectada · responde com base nas informações oficiais' : 'Respostas guiadas pelas informações oficiais da BCM'}</p>
        </div>
        <button type="button" class="as-reset" data-as-reset aria-label="Nova conversa" title="Nova conversa">${icon('plus')}</button>
        <button type="button" class="as-close" data-as-close aria-label="Fechar assistente">${icon('close')}</button>
      </header>
      <div class="as-log" role="log" aria-live="polite" aria-relevant="additions" tabindex="0"></div>
      <div class="as-suggest" aria-label="Sugestões">${SUGGESTIONS.map((s) => `<button type="button" class="chip chip-sm" data-suggest>${esc(s)}</button>`).join('')}</div>
      <form class="as-form" data-as-form>
        <label for="as-input" class="visually-hidden">Sua pergunta</label>
        <input id="as-input" type="text" autocomplete="off" maxlength="400" placeholder="Pergunte sobre a BCM…">
        <button type="submit" class="as-send" aria-label="Enviar">${icon('send')}</button>
      </form>
      <p class="as-disclaimer">${icon('shield')}<span>${esc(DISCLAIMER)} Não envie dados pessoais ou de saúde.</span></p>
    </div>`,
  );
  panel = document.getElementById('assistant-panel');
  log = panel.querySelector('.as-log');
  input = panel.querySelector('#as-input');
  renderLog();

  panel.addEventListener('click', (e) => {
    const choice = e.target.closest('[data-choice]');
    if (choice) return send(choice.dataset.choice, choice.textContent.trim());
    const sug = e.target.closest('[data-suggest]');
    if (sug) return send(sug.textContent.trim());
    if (e.target.closest('[data-as-close]')) return close();
    if (e.target.closest('[data-as-reset]')) {
      history = [];
      state = {};
      save();
      renderLog();
      input.focus();
    }
  });
  panel.querySelector('[data-as-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = '';
    send(v);
  });
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

export function open(intent = '') {
  if (!panel) build();
  panel.hidden = false;
  requestAnimationFrame(() => panel.classList.add('is-open'));
  document.documentElement.classList.add('assistant-open');
  launcher?.setAttribute('aria-expanded', 'true');
  if (intent === 'agendar') send('booking:start', 'Quero agendar um atendimento');
  else if (intent) send(intent);
  setTimeout(() => input.focus({ preventScroll: true }), 60);
}

export function close() {
  if (!panel) return;
  panel.classList.remove('is-open');
  document.documentElement.classList.remove('assistant-open');
  launcher?.setAttribute('aria-expanded', 'false');
  setTimeout(() => (panel.hidden = true), reduceMotion() ? 0 : 280);
  launcher?.focus({ preventScroll: true });
}

export const isOpen = () => Boolean(panel && !panel.hidden);
