// ── TOAST ───────────────────────────────────────────────

export function showToast(msg, type = 'info', duration = 2400) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = 'toast anim-slide-up';
  el.style.cssText = [
    'position:fixed',
    'bottom:calc(var(--nav-h) + 16px)',
    'left:50%',
    'transform:translateX(-50%)',
    'background:var(--bg-secondary)',
    'border:0.5px solid var(--separator)',
    'color:var(--label-primary)',
    'padding:10px 20px',
    'border-radius:var(--r-pill)',
    'font-size:var(--text-sm)',
    'font-weight:600',
    'z-index:500',
    'box-shadow:var(--shadow-md)',
    'white-space:nowrap',
  ].join(';');

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  el.textContent = `${icons[type] ?? ''} ${msg}`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

// ── PROGRESS BAR ─────────────────────────────────────────

export function setProgress(selector, pct, color) {
  const el = document.querySelector(selector);
  if (!el) return;
  const fill = el.querySelector('.progress-fill');
  if (!fill) return;
  fill.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  if (color) fill.style.background = color;
}

// ── RING SVG ───────────────────────────────────────────────

/**
 * Crée un ring SVG animé style Apple Activity
 * @param {number} pct    - pourcentage 0-100
 * @param {string} color  - couleur du ring
 * @param {number} size   - taille px (défaut 52)
 * @param {number} stroke - épaisseur (défaut 5)
 * @returns {SVGElement}
 */
export function createRing(pct, color, size = 52, stroke = 5) {
  const r      = (size - stroke) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.classList.add('ring-svg');

  const track = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  track.setAttribute('cx', size / 2);
  track.setAttribute('cy', size / 2);
  track.setAttribute('r', r);
  track.setAttribute('stroke-width', stroke);
  track.classList.add('ring-track');

  const fill = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  fill.setAttribute('cx', size / 2);
  fill.setAttribute('cy', size / 2);
  fill.setAttribute('r', r);
  fill.setAttribute('stroke-width', stroke);
  fill.setAttribute('stroke', color);
  fill.setAttribute('stroke-dasharray', circ);
  fill.setAttribute('stroke-dashoffset', circ);
  fill.classList.add('ring-fill');

  svg.appendChild(track);
  svg.appendChild(fill);

  requestAnimationFrame(() => {
    fill.style.transition = 'stroke-dashoffset 0.9s cubic-bezier(0.25,0.46,0.45,0.94)';
    fill.setAttribute('stroke-dashoffset', offset);
  });

  return svg;
}

// ── CONFETTI ──────────────────────────────────────────────

export function launchConfetti(duration = 2200) {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#FF453A','#30D158','#0A84FF','#FF9F0A','#BF5AF2','#5AC8FA'];
  const pieces = Array.from({ length: 90 }, () => ({
    x    : Math.random() * canvas.width,
    y    : Math.random() * -canvas.height,
    w    : 8 + Math.random() * 8,
    h    : 4 + Math.random() * 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rot  : Math.random() * Math.PI * 2,
    vx   : (Math.random() - 0.5) * 3,
    vy   : 2 + Math.random() * 4,
    vr   : (Math.random() - 0.5) * 0.15,
  }));

  const start = performance.now();
  function draw(now) {
    if (now - start > duration) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

// ── TIMER ─────────────────────────────────────────────────

/**
 * Crée un timer décomptant en secondes
 * @param {number}   totalSeconds
 * @param {Function} onTick(remaining) - appelé chaque seconde
 * @param {Function} onEnd()           - appelé à 0
 * @returns {{ stop: Function }}
 */
export function createTimer(totalSeconds, onTick, onEnd) {
  let remaining = totalSeconds;
  const id = setInterval(() => {
    remaining--;
    onTick(remaining);
    if (remaining <= 0) {
      clearInterval(id);
      onEnd();
    }
  }, 1000);
  return { stop: () => clearInterval(id) };
}

export function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// ── THEME ─────────────────────────────────────────────────

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

// ── ANIM HELPERS ──────────────────────────────────────────

export function animShake(el) {
  if (!el) return;
  el.classList.remove('anim-shake');
  void el.offsetWidth;
  el.classList.add('anim-shake');
}

export function animPop(el) {
  if (!el) return;
  el.classList.remove('anim-pop');
  void el.offsetWidth;
  el.classList.add('anim-pop');
}

// ── SCROLL TOP ───────────────────────────────────────────

export function scrollTop() {
  document.getElementById('app')?.scrollTo({ top: 0, behavior: 'smooth' });
}
