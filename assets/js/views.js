import { DECKS }                                    from './data.js';
import { getProgress, getTodayCount, getStreak,
         getLast7Days, getSettings, saveSetting,
         clearAll }                                from './store.js';
import { countDue }                                from './sm2.js';
import { navigate }                                from './router.js';
import { createRing, applyTheme, showToast }       from './ui.js';

const app = () => document.getElementById('app');

// ── HOME ─────────────────────────────────────────────────

export function renderHome() {
  const today    = getTodayCount();
  const streak   = getStreak();
  const settings = getSettings();
  const goal     = settings.dailyGoal ?? 20;
  const goalPct  = Math.min(100, Math.round((today / goal) * 100));
  const progress = getProgress();

  const totalDue = DECKS.reduce((acc, d) =>
    acc + countDue(d.cards, progress), 0);

  app().innerHTML = `
    <div class="view">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--sp-5)">
        <div>
          <div style="font-size:var(--text-xs);color:var(--label-secondary);font-weight:600;text-transform:uppercase;letter-spacing:0.06em">DAEU Révisions</div>
          <h1 style="font-family:var(--font-display);font-size:var(--text-2xl);font-weight:700;letter-spacing:-0.8px;line-height:1.1">Bonne révision 👋</h1>
        </div>
        <div style="text-align:right">
          <div style="font-size:var(--text-2xl);font-weight:700;font-family:var(--font-display);color:var(--orange)">🔥 ${streak}</div>
          <div style="font-size:var(--text-xs);color:var(--label-secondary)">jours consécutifs</div>
        </div>
      </div>

      <div class="card" style="padding:var(--sp-4);margin-bottom:var(--sp-4)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--sp-2)">
          <span style="font-weight:600;font-size:var(--text-base)">Objectif du jour</span>
          <span style="font-size:var(--text-sm);color:var(--label-secondary)">${today} / ${goal} cartes</span>
        </div>
        <div class="progress-bar" id="goal-bar">
          <div class="progress-fill" style="width:${goalPct}%;background:var(--green)"></div>
        </div>
        ${totalDue > 0
          ? `<div style="margin-top:var(--sp-2);font-size:var(--text-sm);color:var(--red);font-weight:600">⚡ ${totalDue} carte${totalDue > 1 ? 's' : ''} à réviser</div>`
          : `<div style="margin-top:var(--sp-2);font-size:var(--text-sm);color:var(--green);font-weight:600">✅ Tout est à jour !</div>`}
      </div>

      <div class="stats-grid" style="margin-bottom:var(--sp-4)">
        <div class="card stat-card">
          <div class="stat-value" style="color:var(--blue)">${today}</div>
          <div class="stat-label">Aujourd'hui</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value" style="color:var(--orange)">🔥${streak}</div>
          <div class="stat-label">Streak</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value" style="color:var(--red)">${totalDue}</div>
          <div class="stat-label">Dues</div>
        </div>
      </div>

      <h2 class="section-title sm">Matières</h2>
      <div class="deck-grid anim-stagger">
        ${DECKS.map(d => {
          const due = countDue(d.cards, progress);
          return `
          <div class="card deck-card" data-deck="${d.id}">
            <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${d.color};border-radius:var(--r-lg) var(--r-lg) 0 0"></div>
            ${due > 0 ? `<span class="deck-badge">${due}</span>` : ''}
            <span class="deck-emoji">${d.icon}</span>
            <div class="deck-name">${d.name}</div>
            <div class="deck-meta">${d.cards.length} cartes</div>
          </div>`;
        }).join('')}
      </div>

      <h2 class="section-title sm" style="margin-top:var(--sp-6)">Mode Examen</h2>
      <div class="card" style="padding:var(--sp-4);display:flex;align-items:center;gap:var(--sp-4);cursor:pointer" id="exam-entry">
        <div style="font-size:2rem">🎯</div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:var(--text-base)">Simulation d'examen</div>
          <div style="font-size:var(--text-sm);color:var(--label-secondary)">Timer • QCM • Score final</div>
        </div>
        <div style="color:var(--label-tertiary)">›</div>
      </div>
    </div>
  `;

  app().querySelectorAll('.deck-card').forEach(el => {
    el.addEventListener('click', () => navigate('study', { deckId: el.dataset.deck }));
  });
  document.getElementById('exam-entry')?.addEventListener('click', () => navigate('exam'));
}

// ── DECKS ────────────────────────────────────────────────

export function renderDecks() {
  const progress = getProgress();
  app().innerHTML = `
    <div class="view">
      <h1 class="section-title">Mes decks 📚</h1>
      <div class="deck-grid anim-stagger">
        ${DECKS.map(d => {
          const due     = countDue(d.cards, progress);
          const done    = d.cards.filter(c => progress[c.id]?.repetitions > 0).length;
          const donePct = Math.round((done / d.cards.length) * 100);
          return `
          <div class="card deck-card" data-deck="${d.id}">
            <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${d.color};border-radius:var(--r-lg) var(--r-lg) 0 0"></div>
            ${due > 0 ? `<span class="deck-badge">${due}</span>` : ''}
            <span class="deck-emoji">${d.icon}</span>
            <div class="deck-name">${d.name}</div>
            <div class="deck-meta">${donePct}% maîtrisé · ${due} due${due !== 1 ? 's' : ''}</div>
            <div class="progress-bar" style="margin-top:var(--sp-2)">
              <div class="progress-fill" style="width:${donePct}%;background:${d.color}"></div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;

  app().querySelectorAll('.deck-card').forEach(el => {
    el.addEventListener('click', () => navigate('study', { deckId: el.dataset.deck }));
  });
}

// ── STATS ────────────────────────────────────────────────

export function renderStats() {
  const progress = getProgress();
  const days     = getLast7Days();
  const maxCount = Math.max(...days.map(d => d.count), 1);
  const DAY_LABELS = ['D-6','D-5','D-4','D-3','D-2','Hier','Auj.'];

  app().innerHTML = `
    <div class="view">
      <h1 class="section-title">Statistiques 📊</h1>

      <div class="card" style="padding:var(--sp-4);margin-bottom:var(--sp-4)">
        <div style="font-weight:600;margin-bottom:var(--sp-3)">7 derniers jours</div>
        <div class="bar-chart">
          ${days.map((d, i) => `
          <div class="bar-col">
            <div class="bar-val">${d.count || ''}</div>
            <div class="bar-rect" style="height:${Math.round((d.count / maxCount) * 80)}px;background:var(--blue);opacity:${i === 6 ? 1 : 0.45}"></div>
            <div class="bar-lbl">${DAY_LABELS[i]}</div>
          </div>`).join('')}
        </div>
      </div>

      <h2 class="section-title sm">Maîtrise par matière</h2>
      <div class="card" style="padding:var(--sp-4)">
        <div class="rings-container" id="rings-wrap"></div>
      </div>
    </div>
  `;

  const wrap = document.getElementById('rings-wrap');
  DECKS.forEach(d => {
    const done = d.cards.filter(c => progress[c.id]?.repetitions > 0).length;
    const pct  = Math.round((done / d.cards.length) * 100);
    const row  = document.createElement('div');
    row.className = 'ring-row';
    row.appendChild(createRing(pct, d.color, 56, 6));
    row.innerHTML += `
      <div class="ring-info">
        <div class="ring-subject">${d.icon} ${d.name}</div>
        <div class="ring-pct" style="color:${d.color}">${pct}%</div>
        <div class="ring-detail">${done} / ${d.cards.length} cartes vues</div>
      </div>`;
    wrap.appendChild(row);
  });
}

// ── SETTINGS ─────────────────────────────────────────────

export function renderSettings() {
  const s = getSettings();
  app().innerHTML = `
    <div class="view">
      <h1 class="section-title">Réglages ⚙️</h1>

      <div class="card" style="padding:0 var(--sp-4)">

        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-title">Thème</div>
            <div class="setting-desc">Sombre ou clair</div>
          </div>
          <div style="display:flex;gap:var(--sp-2)">
            <button class="btn btn-sm ${s.theme === 'dark'  ? 'btn-primary' : 'btn-secondary'}" data-theme="dark">🌙</button>
            <button class="btn btn-sm ${s.theme === 'light' ? 'btn-primary' : 'btn-secondary'}" data-theme="light">☀️</button>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-title">Objectif quotidien</div>
            <div class="setting-desc" id="goal-desc">${s.dailyGoal} cartes par jour</div>
          </div>
          <input type="range" id="goal-range" min="5" max="100" step="5" value="${s.dailyGoal}"
            style="width:110px;accent-color:var(--blue)">
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-title">Afficher le timer</div>
            <div class="setting-desc">Chrono en mode étude</div>
          </div>
          <div class="toggle ${s.showTimer ? 'on' : ''}" id="toggle-timer"></div>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-title">Version</div>
            <div class="setting-desc">DAEU Révisions v2.0</div>
          </div>
          <span style="color:var(--label-tertiary);font-size:var(--text-sm)">2026</span>
        </div>

      </div>

      <div style="margin-top:var(--sp-6)">
        <button class="btn btn-danger btn-full" id="reset-btn">🗑️ Réinitialiser toute la progression</button>
      </div>
    </div>
  `;

  app().querySelectorAll('[data-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      saveSetting('theme', btn.dataset.theme);
      applyTheme(btn.dataset.theme);
      renderSettings();
    });
  });

  const range = document.getElementById('goal-range');
  range?.addEventListener('input', () => {
    saveSetting('dailyGoal', parseInt(range.value));
    const desc = document.getElementById('goal-desc');
    if (desc) desc.textContent = `${range.value} cartes par jour`;
  });

  document.getElementById('toggle-timer')?.addEventListener('click', function () {
    const val = !getSettings().showTimer;
    saveSetting('showTimer', val);
    this.classList.toggle('on', val);
  });

  document.getElementById('reset-btn')?.addEventListener('click', () => {
    if (confirm('Supprimer toute la progression ? Cette action est irréversible.')) {
      clearAll();
      showToast('Progression réinitialisée', 'success');
      navigate('home');
    }
  });
}

// ── FICHE ────────────────────────────────────────────────

export function renderFiche(deckId, ficheId) {
  const deck = DECKS.find(d => d.id === deckId);
  if (!deck) { navigate('home'); return; }
  const fiches = deck.fiches ?? [];
  const idx    = ficheId ? fiches.findIndex(f => f.id === ficheId) : 0;
  const fiche  = fiches[idx] ?? fiches[0];
  if (!fiche) { navigate('decks'); return; }

  app().innerHTML = `
    <div class="view">
      <div style="display:flex;align-items:center;gap:var(--sp-3);margin-bottom:var(--sp-4)">
        <button class="btn btn-ghost btn-sm" id="back-btn">‹ Retour</button>
        <span style="font-size:var(--text-sm);color:var(--label-secondary)">${deck.icon} ${deck.name}</span>
      </div>
      <div class="fiche-title">${fiche.title}</div>
      <div class="card" style="padding:var(--sp-5)">
        <pre class="fiche-content">${fiche.content}</pre>
      </div>
      <div class="fiche-nav">
        <button class="btn btn-secondary btn-sm" id="prev-fiche" ${idx === 0 ? 'disabled' : ''}>‹ Précédent</button>
        <span style="font-size:var(--text-xs);color:var(--label-tertiary)">${idx + 1} / ${fiches.length}</span>
        <button class="btn btn-secondary btn-sm" id="next-fiche" ${idx === fiches.length - 1 ? 'disabled' : ''}>Suivant ›</button>
      </div>
    </div>
  `;

  document.getElementById('back-btn')?.addEventListener('click',   () => navigate('study', { deckId }));
  document.getElementById('prev-fiche')?.addEventListener('click', () => renderFiche(deckId, fiches[idx - 1]?.id));
  document.getElementById('next-fiche')?.addEventListener('click', () => renderFiche(deckId, fiches[idx + 1]?.id));
}
