import { initRouter, onNavigate, updateNavBar } from './router.js';
import { getSettings }                          from './store.js';
import { applyTheme }                           from './ui.js';
import { renderHome, renderDecks,
         renderStats, renderSettings }          from './views.js';
import { renderStudy }                          from './study.js';
import { renderExam }                           from './exam.js';

// ── DISPATCH ────────────────────────────────────────────

function dispatch(view, params = {}) {
  switch (view) {
    case 'home':     renderHome();                break;
    case 'decks':    renderDecks();               break;
    case 'stats':    renderStats();               break;
    case 'settings': renderSettings();            break;
    case 'study':    renderStudy(params.deckId);  break;
    case 'exam':     renderExam();                break;
    default:         renderHome();
  }
  updateNavBar();
  document.getElementById('app')?.scrollTo({ top: 0, behavior: 'instant' });
}

// ── INIT ─────────────────────────────────────────────────

function init() {
  const { theme } = getSettings();
  applyTheme(theme);

  onNavigate(dispatch);
  initRouter();

  document.querySelector('.nav-bar')?.addEventListener('click', e => {
    const item = e.target.closest('.nav-item');
    if (item?.dataset.view) {
      import('./router.js').then(({ navigate }) => navigate(item.dataset.view));
    }
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .catch(err => console.warn('[SW] registration failed:', err));
  }
}

document.addEventListener('DOMContentLoaded', init);
