// Vues disponibles
const VIEWS = ['home', 'decks', 'stats', 'settings', 'study', 'exam', 'fiche'];

let _currentView   = 'home';
let _currentParams = {};
const _listeners   = [];

// ── NAVIGATION ─────────────────────────────────────────────

/**
 * Navigue vers une vue avec paramètres optionnels
 * @param {string} view   - nom de la vue
 * @param {Object} params - ex: { deckId: 'eng', mode: 'flip' }
 */
export function navigate(view, params = {}) {
  if (!VIEWS.includes(view)) {
    console.warn(`[router] Vue inconnue : ${view}`);
    return;
  }
  _currentView   = view;
  _currentParams = params;

  const hash = params && Object.keys(params).length
    ? `#${view}?${new URLSearchParams(params).toString()}`
    : `#${view}`;
  history.pushState({ view, params }, '', hash);

  _notify();
}

export function getCurrentView()   { return _currentView; }
export function getCurrentParams() { return { ..._currentParams }; }

// ── ABONNEMENT ───────────────────────────────────────────

export function onNavigate(fn) {
  _listeners.push(fn);
  return () => {
    const i = _listeners.indexOf(fn);
    if (i !== -1) _listeners.splice(i, 1);
  };
}

function _notify() {
  _listeners.forEach(fn => fn(_currentView, _currentParams));
}

// ── NAV BAR ───────────────────────────────────────────────

export function updateNavBar() {
  document.querySelectorAll('.nav-item').forEach(el => {
    const v = el.dataset.view;
    el.classList.toggle('active', v === _currentView);
  });
}

// ── INIT ───────────────────────────────────────────────────

export function initRouter() {
  function parseHash() {
    const raw = location.hash.slice(1);
    if (!raw) return { view: 'home', params: {} };
    const [view, qs] = raw.split('?');
    const params = qs ? Object.fromEntries(new URLSearchParams(qs)) : {};
    return { view: VIEWS.includes(view) ? view : 'home', params };
  }

  const { view, params } = parseHash();
  _currentView   = view;
  _currentParams = params;

  window.addEventListener('popstate', (e) => {
    if (e.state?.view) {
      _currentView   = e.state.view;
      _currentParams = e.state.params ?? {};
    } else {
      const parsed   = parseHash();
      _currentView   = parsed.view;
      _currentParams = parsed.params;
    }
    _notify();
    updateNavBar();
  });

  _notify();
  updateNavBar();
}
