import '@fontsource-variable/manrope';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import './styles/main.css';

import { mountIntro, mountHeader } from './client/header.js';
import { mountReveal, mountParallax, mountMagnetic, mountTilt, mountCounters } from './client/motion.js';
import {
  mountOpenStatus, mountCursorOrb, mountSmartSearch, mountExplorer, mountFinder,
  mountGallery, mountFAQ, mountMap, mountTimeline,
} from './client/sections.js';

/** Assistente BCM: código carregado somente quando alguém o abre. */
let assistant;
const openAssistant = async (intent = '') => {
  assistant ??= await import('./assistant/Assistant.js');
  if (assistant.isOpen() && !intent) return assistant.close();
  assistant.open(intent);
};

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-assistant-open]');
  if (!trigger) return;
  e.preventDefault();
  openAssistant(trigger.dataset.assistantOpen);
});
// Pré-carrega o assistente quando o navegador estiver ocioso.
const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 2500));
idle(() => import('./assistant/Assistant.js'));

document.documentElement.classList.add('ready');
mountIntro();
mountHeader();
mountReveal();
mountParallax();
mountMagnetic();
mountTilt();
mountCounters();
mountOpenStatus();
mountCursorOrb();
mountSmartSearch(openAssistant);
mountExplorer();
mountFinder();
mountGallery();
mountFAQ(openAssistant);
mountMap();
mountTimeline();
