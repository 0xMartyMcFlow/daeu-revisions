import { DECKS }                            from './data.js';
import { saveCardResult, incrementToday,
         saveSession, getSession }           from './store.js';
import { sm2 }                              from './sm2.js';
import { navigate }                         from './router.js';
import { createTimer, formatTime,
         launchConfetti, showToast,
         animShake, animPop }               from './ui.js';

const app  = () => document.getElementById('app');
const EXAM_DURATION = 45 * 60;
const EXAM_COUNT    = 30;

// ── ENTRÉE EXAMEN ────────────────────────────────────────

export function renderExam() {
  const lastSession = getSession();

  app().innerHTML = `
    <div class="view" style="text-align:center;padding-top:var(--sp-6)">
      <div style="font-size:3rem;margin-bottom:var(--sp-3)">🎯</div>
      <h1 style="font-family:var(--font-display);font-size:var(--text-2xl);font-weight:700;margin-bottom:var(--sp-2)">Simulation d'examen</h1>
      <p style="color:var(--label-secondary);margin-bottom:var(--sp-6);max-width:300px;margin-inline:auto">
        ${EXAM_COUNT} questions · Toutes matières · Timer ${Math.floor(EXAM_DURATION / 60)} min
      </p>

      ${lastSession ? `
      <div class="card" style="padding:var(--sp-4);margin-bottom:var(--sp-4);text-align:left">
        <div style="font-weight:600;margin-bottom:var(--sp-1)">Dernière session</div>
        <div style="font-size:var(--text-sm);color:var(--label-secondary)">${lastSession.date} · Score : <strong style="color:${lastSession.pct >= 50 ? 'var(--green)' : 'var(--red)'}">${lastSession.pct}%</strong></div>
      </div>` : ''}

      <div style="display:flex;flex-direction:column;gap:var(--sp-3);max-width:320px;margin:0 auto">
        <button class="btn btn-primary btn-full" style="font-size:var(--text-md);padding:var(--sp-4)" id="start-exam">🚀 Démarrer</button>
        <button class="btn btn-ghost btn-full" id="cancel-exam">Annuler</button>
      </div>
    </div>
  `;

  document.getElementById('start-exam')?.addEventListener('click', startExam);
  document.getElementById('cancel-exam')?.addEventListener('click', () => navigate('home'));
}

// ── DÉMARRAGE ────────────────────────────────────────────

function startExam() {
  const allCards = [];
  const perDeck  = Math.max(1, Math.floor(EXAM_COUNT / DECKS.length));
  DECKS.forEach(deck => {
    const picked = shuffle(deck.cards).slice(0, perDeck)
      .map(c => ({ ...c, deckId: deck.id, deckColor: deck.color, deckIcon: deck.icon }));
    allCards.push(...picked);
  });
  const queue = shuffle(allCards).slice(0, EXAM_COUNT);

  let idx       = 0;
  let correct   = 0;
  let results   = [];
  let timer     = null;
  let remaining = EXAM_DURATION;

  function tick(rem) {
    remaining = rem;
    const el  = document.getElementById('exam-timer');
    if (el) {
      el.textContent = formatTime(rem);
      if (rem <= 300) el.style.color = 'var(--red)';
    }
  }

  function timeUp() {
    showToast('⏰ Temps écoulé !', 'warning', 3000);
    finishExam(queue, results, correct);
  }

  function next() {
    if (idx >= queue.length) { timer?.stop(); finishExam(queue, results, correct); return; }
    renderQuestion(queue, idx, remaining, onAnswer);
  }

  function onAnswer(isCorrect) {
    results.push({ cardId: queue[idx].id, deckId: queue[idx].deckId, isCorrect });
    if (isCorrect) correct++;
    incrementToday();
    if (!isCorrect) saveCardResult(queue[idx].id, sm2({}, 1));
    idx++;
    next();
  }

  next();
  setTimeout(() => { timer = createTimer(EXAM_DURATION, tick, timeUp); }, 100);
}

// ── QUESTION ─────────────────────────────────────────────

function renderQuestion(queue, idx, remaining, onAnswer) {
  const card    = queue[idx];
  const deck    = DECKS.find(d => d.id === card.deckId);
  const others  = deck.cards.filter(c => c.id !== card.id);
  const wrongs  = shuffle(others).slice(0, 3).map(c => c.b.split('\n')[0]);
  const correct = card.b.split('\n')[0];
  const options = shuffle([correct, ...wrongs]);
  const pct     = Math.round((idx / queue.length) * 100);

  app().innerHTML = `
    <div class="view" style="display:flex;flex-direction:column;align-items:center">
      <div style="width:100%;max-width:460px;margin-bottom:var(--sp-3)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--sp-2)">
          <span style="font-size:var(--text-sm);color:var(--label-secondary);font-weight:600">${idx + 1} / ${queue.length}</span>
          <span id="exam-timer" style="font-family:var(--font-display);font-weight:700;font-size:var(--text-lg)">${formatTime(remaining)}</span>
          <span style="font-size:var(--text-sm);font-weight:600;color:${card.deckColor}">${card.deckIcon} ${deck?.name ?? ''}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%;background:var(--blue)"></div>
        </div>
      </div>

      <div class="card" style="padding:var(--sp-5);width:100%;max-width:460px;text-align:center;margin-bottom:var(--sp-3)">
        <div style="font-size:var(--text-xs);font-weight:700;color:${card.deckColor};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:var(--sp-2)">${card.deckIcon} ${deck?.name ?? ''}</div>
        <p style="font-size:var(--text-md);font-weight:600;line-height:1.6">${card.f}</p>
      </div>

      <div class="mcq-list" style="width:100%;max-width:460px">
        ${options.map((o, i) => `
        <button class="mcq-option" data-idx="${i}" data-correct="${o === correct}">${o}</button>`).join('')}
      </div>
    </div>
  `;

  app().querySelectorAll('.mcq-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.dataset.correct === 'true';
      app().querySelectorAll('.mcq-option').forEach(b => {
        b.disabled = true;
        if (b.dataset.correct === 'true') b.classList.add('correct');
        else b.classList.add('revealed');
      });
      if (!isCorrect) { btn.classList.remove('revealed'); btn.classList.add('wrong'); animShake(btn); }
      else animPop(btn);
      setTimeout(() => onAnswer(isCorrect), 700);
    });
  });
}

// ── FIN D'EXAMEN ─────────────────────────────────────────

function finishExam(queue, results, correct) {
  const total  = results.length;
  const pct    = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = pct >= 50;

  saveSession({ date: new Date().toLocaleDateString('fr-FR'), pct, correct, total, passed });
  if (pct >= 70) launchConfetti();

  const byDeck = {};
  DECKS.forEach(d => { byDeck[d.id] = { correct: 0, total: 0, icon: d.icon, name: d.name, color: d.color }; });
  results.forEach(r => {
    if (!byDeck[r.deckId]) return;
    byDeck[r.deckId].total++;
    if (r.isCorrect) byDeck[r.deckId].correct++;
  });

  app().innerHTML = `
    <div class="view" style="text-align:center">
      <div style="padding-top:var(--sp-6);margin-bottom:var(--sp-5)">
        <div style="font-size:3.5rem;margin-bottom:var(--sp-2)">${pct >= 80 ? '🏆' : pct >= 50 ? '✅' : '📚'}</div>
        <h1 style="font-family:var(--font-display);font-size:var(--text-2xl);font-weight:700;margin-bottom:var(--sp-1)">${passed ? 'Félicitations !' : 'Continue à bosser !'}</h1>
        <div style="font-size:4.5rem;font-weight:700;font-family:var(--font-display);color:${passed ? 'var(--green)' : 'var(--red)'};line-height:1">${pct}%</div>
        <p style="color:var(--label-secondary);margin-top:var(--sp-2)">${correct} / ${total} bonnes réponses</p>
      </div>

      <div class="card" style="padding:var(--sp-4);text-align:left;margin-bottom:var(--sp-5)">
        <div style="font-weight:700;margin-bottom:var(--sp-3)">Détail par matière</div>
        ${Object.values(byDeck).filter(d => d.total > 0).map(d => {
          const p = Math.round((d.correct / d.total) * 100);
          return `
          <div style="margin-bottom:var(--sp-3)">
            <div style="display:flex;justify-content:space-between;margin-bottom:var(--sp-1)">
              <span style="font-size:var(--text-sm);font-weight:600">${d.icon} ${d.name}</span>
              <span style="font-size:var(--text-sm);font-weight:700;color:${d.color}">${p}% (${d.correct}/${d.total})</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${p}%;background:${d.color}"></div>
            </div>
          </div>`;
        }).join('')}
      </div>

      <div style="display:flex;flex-direction:column;gap:var(--sp-3);max-width:320px;margin:0 auto">
        <button class="btn btn-primary btn-full" id="retry-exam">🔄 Réessayer</button>
        <button class="btn btn-secondary btn-full" id="home-exam">🏠 Accueil</button>
      </div>
    </div>
  `;

  document.getElementById('retry-exam')?.addEventListener('click', renderExam);
  document.getElementById('home-exam')?.addEventListener('click',  () => navigate('home'));
}

// ── HELPERS ──────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
