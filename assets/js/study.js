import { DECKS }                                    from './data.js';
import { getProgress, saveCardResult,
         getDueCards, incrementToday }              from './store.js';
import { sm2 }                                      from './sm2.js';
import { navigate }                                 from './router.js';
import { showToast, animShake, animPop,
         launchConfetti, scrollTop }                from './ui.js';
import { renderFiche }                              from './views.js';
import { icon }                                     from './icons.js';

const app = () => document.getElementById('app');

// ── ENTRÉE DECK ────────────────────────────────────────────

export function renderStudy(deckId) {
  const deck = DECKS.find(d => d.id === deckId);
  if (!deck) { navigate('home'); return; }

  const progress = getProgress();
  const due      = getDueCards(deck.cards).length;
  const done     = deck.cards.filter(c => progress[c.id]?.repetitions > 0).length;
  const donePct  = Math.round((done / deck.cards.length) * 100);

  app().innerHTML = `
    <div class="view">
      <div style="display:flex;align-items:center;gap:var(--sp-3);margin-bottom:var(--sp-5)">
        <button class="btn btn-ghost btn-sm" id="back-home" style="gap:4px">${icon('CHEVRON_LEFT',16)} Accueil</button>
        <span style="font-size:1.5rem">${deck.icon}</span>
        <span style="font-weight:700;font-size:var(--text-md)">${deck.name}</span>
      </div>

      <div class="stats-grid" style="margin-bottom:var(--sp-5)">
        <div class="card stat-card"><div class="stat-value" style="color:var(--red)">${due}</div><div class="stat-label">À réviser</div></div>
        <div class="card stat-card"><div class="stat-value" style="color:var(--green)">${done}</div><div class="stat-label">Vues</div></div>
        <div class="card stat-card"><div class="stat-value" style="color:${deck.color}">${donePct}%</div><div class="stat-label">Maîtrise</div></div>
      </div>

      <h2 class="section-title sm">Mode d'étude</h2>
      <div style="display:flex;flex-direction:column;gap:var(--sp-3);margin-bottom:var(--sp-5)">
        <button class="card" style="padding:var(--sp-4);display:flex;align-items:center;gap:var(--sp-4);text-align:left;cursor:pointer" data-mode="flip">
          <span class="icon icon-xl" style="color:var(--blue)">${icon('FLIP', 28)}</span>
          <div><div style="font-weight:700">Flashcards</div><div style="font-size:var(--text-sm);color:var(--label-secondary)">Retourne et note ta réponse</div></div>
          <span class="icon icon-muted" style="margin-left:auto">${icon('CHEVRON_RIGHT')}</span>
        </button>
        <button class="card" style="padding:var(--sp-4);display:flex;align-items:center;gap:var(--sp-4);text-align:left;cursor:pointer" data-mode="mcq">
          <span class="icon icon-xl" style="color:var(--green)">${icon('MCQ', 28)}</span>
          <div><div style="font-weight:700">QCM</div><div style="font-size:var(--text-sm);color:var(--label-secondary)">4 choix, 1 bonne réponse</div></div>
          <span class="icon icon-muted" style="margin-left:auto">${icon('CHEVRON_RIGHT')}</span>
        </button>
        <button class="card" style="padding:var(--sp-4);display:flex;align-items:center;gap:var(--sp-4);text-align:left;cursor:pointer" data-mode="type">
          <span class="icon icon-xl" style="color:var(--purple)">${icon('KEYBOARD', 28)}</span>
          <div><div style="font-weight:700">Saisie libre</div><div style="font-size:var(--text-sm);color:var(--label-secondary)">Écris la réponse</div></div>
          <span class="icon icon-muted" style="margin-left:auto">${icon('CHEVRON_RIGHT')}</span>
        </button>
      </div>

      ${deck.fiches?.length ? `
      <h2 class="section-title sm">Fiches de cours</h2>
      <div style="display:flex;flex-direction:column;gap:var(--sp-2)">
        ${deck.fiches.map(f => `
        <div class="list-item" data-fiche="${f.id}">
          <span class="icon icon-md" style="color:var(--blue)">${icon('DOC')}</span>
          <div class="item-title">${f.title}</div>
          <span class="icon icon-muted">${icon('CHEVRON_RIGHT')}</span>
        </div>`).join('')}
      </div>` : ''}
    </div>
  `;

  document.getElementById('back-home')?.addEventListener('click', () => navigate('home'));
  app().querySelectorAll('[data-mode]').forEach(btn =>
    btn.addEventListener('click', () => startSession(deck, btn.dataset.mode)));
  app().querySelectorAll('[data-fiche]').forEach(el =>
    el.addEventListener('click', () => renderFiche(deck.id, el.dataset.fiche)));
}

// ── SESSION ───────────────────────────────────────────────

function startSession(deck, mode) {
  const progress = getProgress();
  let queue = getDueCards(deck.cards);
  if (queue.length === 0) queue = [...deck.cards];
  queue = shuffle(queue);
  let idx = 0, correct = 0, total = 0;

  function next() {
    if (idx >= queue.length) { endSession(deck, correct, total); return; }
    const card = queue[idx];
    if (mode === 'flip') renderFlip(deck, card, queue, idx, onGrade);
    if (mode === 'mcq')  renderMCQ(deck, card, queue, idx, onAnswer);
    if (mode === 'type') renderType(deck, card, queue, idx, onAnswer);
    scrollTop();
  }
  function onGrade(grade) {
    const result = sm2(progress[queue[idx].id] ?? {}, grade);
    saveCardResult(queue[idx].id, result);
    incrementToday();
    if (grade >= 3) correct++;
    total++; idx++; next();
  }
  function onAnswer(isCorrect) { onGrade(isCorrect ? 4 : 0); }
  next();
}

// ── FLIP ──────────────────────────────────────────────────

function renderFlip(deck, card, queue, idx, onGrade) {
  let flipped = false;
  app().innerHTML = `
    <div class="view" style="display:flex;flex-direction:column;align-items:center">
      ${sessionHeader(deck, idx, queue.length)}
      <div class="flip-viewport" id="flip-vp">
        <div class="flip-inner" id="flip-inner">
          <div class="flip-front">
            <span class="flip-label">Question</span>
            <p>${card.f}</p>
          </div>
          <div class="flip-back">
            <span class="flip-label">Réponse</span>
            <p style="white-space:pre-wrap">${card.b}</p>
          </div>
        </div>
      </div>
      <p style="font-size:var(--text-sm);color:var(--label-tertiary);margin-top:var(--sp-3)">Appuie pour retourner</p>
      <div class="grade-row" id="grade-row" style="display:none;width:100%;max-width:420px">
        <button class="grade-btn grade-0" data-grade="0">Raté</button>
        <button class="grade-btn grade-3" data-grade="3">Difficile</button>
        <button class="grade-btn grade-4" data-grade="4">Bien</button>
        <button class="grade-btn grade-5" data-grade="5">Parfait</button>
      </div>
    </div>
  `;
  document.getElementById('flip-vp')?.addEventListener('click', () => {
    if (flipped) return;
    flipped = true;
    document.getElementById('flip-inner').classList.add('flipped');
    document.getElementById('grade-row').style.display = 'flex';
  });
  app().querySelectorAll('[data-grade]').forEach(btn =>
    btn.addEventListener('click', () => { animPop(btn); onGrade(parseInt(btn.dataset.grade)); }));
}

// ── MCQ ───────────────────────────────────────────────────

function renderMCQ(deck, card, queue, idx, onAnswer) {
  const others  = deck.cards.filter(c => c.id !== card.id);
  const wrongs  = shuffle(others).slice(0, 3).map(c => c.b.split('\n')[0]);
  const correct = card.b.split('\n')[0];
  const options = shuffle([correct, ...wrongs]);

  app().innerHTML = `
    <div class="view" style="display:flex;flex-direction:column;align-items:center">
      ${sessionHeader(deck, idx, queue.length)}
      <div class="card" style="padding:var(--sp-5);width:100%;max-width:420px;text-align:center;margin-bottom:var(--sp-3)">
        <p style="font-size:var(--text-md);font-weight:600;line-height:1.5">${card.f}</p>
      </div>
      <div class="mcq-list">
        ${options.map((o, i) => `<button class="mcq-option" data-idx="${i}" data-correct="${o === correct}">${o}</button>`).join('')}
      </div>
    </div>
  `;
  app().querySelectorAll('.mcq-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.dataset.correct === 'true';
      app().querySelectorAll('.mcq-option').forEach(b => {
        b.disabled = true;
        b.classList.add(b.dataset.correct === 'true' ? 'correct' : 'revealed');
      });
      if (!isCorrect) { btn.classList.remove('revealed'); btn.classList.add('wrong'); animShake(btn); }
      else animPop(btn);
      setTimeout(() => onAnswer(isCorrect), 900);
    });
  });
}

// ── TYPE ───────────────────────────────────────────────────

function renderType(deck, card, queue, idx, onAnswer) {
  app().innerHTML = `
    <div class="view" style="display:flex;flex-direction:column;align-items:center">
      ${sessionHeader(deck, idx, queue.length)}
      <div class="card" style="padding:var(--sp-5);width:100%;max-width:420px;text-align:center;margin-bottom:var(--sp-3)">
        <p style="font-size:var(--text-md);font-weight:600;line-height:1.5">${card.f}</p>
      </div>
      <div class="type-area">
        <textarea class="type-input" id="type-input" placeholder="Écris ta réponse ici..." rows="4"></textarea>
        <button class="btn btn-primary btn-full" style="margin-top:var(--sp-3)" id="type-submit">Valider</button>
      </div>
      <div id="type-feedback"></div>
    </div>
  `;
  document.getElementById('type-input')?.focus();
  document.getElementById('type-submit')?.addEventListener('click', () => {
    const input = document.getElementById('type-input');
    const val   = input?.value.trim() ?? '';
    if (!val) { showToast('\u00c9cris quelque chose d\'abord', 'warning'); return; }
    const keywords  = card.b.split(/[\n,•\-]+/).map(s => s.trim()).filter(s => s.length > 3);
    const hits      = keywords.filter(kw => val.toLowerCase().includes(kw.toLowerCase().slice(0, 6)));
    const isCorrect = hits.length >= Math.ceil(keywords.length * 0.5);
    const fb = document.getElementById('type-feedback');
    fb.className = `type-feedback ${isCorrect ? 'good' : 'bad'}`;
    fb.innerHTML = `
      <div style="display:flex;align-items:center;gap:6px;font-weight:700;margin-bottom:var(--sp-2)">
        ${isCorrect ? icon('CHECK_CIRCLE', 18) : icon('XMARK_CIRCLE', 18)}
        ${isCorrect ? 'Bien !' : 'À revoir'}
      </div>
      <span style="color:var(--label-secondary);font-size:var(--text-xs)">Réponse attendue :</span>
      <pre style="white-space:pre-wrap;font-size:var(--text-sm);margin-top:4px">${card.b}</pre>
      <button class="btn btn-primary btn-full" style="margin-top:var(--sp-3)" id="type-next">Continuer</button>
    `;
    input.disabled = true;
    document.getElementById('type-submit').disabled = true;
    document.getElementById('type-next')?.addEventListener('click', () => onAnswer(isCorrect));
  });
}

// ── FIN DE SESSION ──────────────────────────────────────────

function endSession(deck, correct, total) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  if (pct >= 70) launchConfetti();
  const resultIcon = pct >= 80 ? icon('TROPHY', 48) : pct >= 50 ? icon('THUMBSUP', 48) : icon('MUSCLE', 48);

  app().innerHTML = `
    <div class="view" style="text-align:center;padding-top:var(--sp-8)">
      <div style="display:flex;justify-content:center;margin-bottom:var(--sp-3)">${resultIcon}</div>
      <h1 style="font-family:var(--font-display);font-size:var(--text-2xl);font-weight:700;margin-bottom:var(--sp-2)">Session terminée !</h1>
      <div style="font-size:4rem;font-weight:700;color:${pct >= 70 ? 'var(--green)' : 'var(--orange)'};font-family:var(--font-display);margin:var(--sp-4) 0">${pct}%</div>
      <p style="color:var(--label-secondary);margin-bottom:var(--sp-6)">${correct} / ${total} cartes correctes</p>
      <div style="display:flex;flex-direction:column;gap:var(--sp-3);max-width:320px;margin:0 auto">
        <button class="btn btn-primary btn-full" id="retry-btn" style="gap:8px">${icon('REFRESH',16)} Recommencer</button>
        <button class="btn btn-secondary btn-full" id="home-btn" style="gap:8px">${icon('HOME',16)} Accueil</button>
      </div>
    </div>
  `;
  document.getElementById('retry-btn')?.addEventListener('click', () => renderStudy(deck.id));
  document.getElementById('home-btn')?.addEventListener('click',  () => navigate('home'));
}

// ── HELPERS ───────────────────────────────────────────────

function sessionHeader(deck, idx, total) {
  const pct  = Math.round((idx / total) * 100);
  const html = `
    <div style="width:100%;max-width:420px;margin-bottom:var(--sp-4)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--sp-2)">
        <button class="btn btn-ghost btn-sm" id="quit-session" style="gap:4px">${icon('XMARK',14)} Quitter</button>
        <span style="font-size:var(--text-sm);color:var(--label-secondary);font-weight:600">${idx + 1} / ${total}</span>
        <span style="font-size:var(--text-sm);color:${deck.color};font-weight:700">${deck.icon} ${deck.name}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${pct}%;background:${deck.color}"></div>
      </div>
    </div>
  `;
  setTimeout(() => {
    document.getElementById('quit-session')?.addEventListener('click', () => renderStudy(deck.id));
  }, 0);
  return html;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
