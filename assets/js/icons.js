/**
 * SVG icon system — Apple SF Symbols style
 * Usage: icons.FLAME  →  SVG string à injecter via innerHTML
 * Taille par défaut : 20×20, stroke currentColor
 *
 * Sources SVG libres :
 *   - Lucide Icons (MIT) https://lucide.dev
 *   - Heroicons (MIT)    https://heroicons.com
 */

const i = (d, opts = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${opts}>${d}</svg>`;

const f = (d, opts = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" ${opts}>${d}</svg>`;

export const icons = {

  // ── Navigation ───────────────────────────────────────────
  HOME: i('<path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/>'),
  DECKS: i('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/>'),
  STATS: i('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'),
  SETTINGS: i('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'),

  // ── Actions ──────────────────────────────────────────────
  FLAME:    f('<path d="M12 2c0 0-5 5-5 10a5 5 0 0 0 10 0c0-3-2-5-2-5s0 3-2 4c0 0 1-6-1-9z" fill="#FF9F0A"/>'),
  BOLT:     f('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#FF9F0A"/>'),
  CHECK_CIRCLE: f('<circle cx="12" cy="12" r="10" fill="#30D158"/><polyline points="9 12 11 14 15 10" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'),
  XMARK_CIRCLE: f('<circle cx="12" cy="12" r="10" fill="#FF453A"/><line x1="15" y1="9" x2="9" y2="15" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="9" y1="9" x2="15" y2="15" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'),
  CHECKMARK: i('<polyline points="20 6 9 17 4 12"/>'),
  XMARK:     i('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
  PLUS:      i('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'),
  TRASH:     f('<polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M9 6V4h6v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>'),
  REFRESH:   i('<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>'),
  QUIT:      i('<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'),

  // ── Chevrons ─────────────────────────────────────────────
  CHEVRON_RIGHT: i('<polyline points="9 18 15 12 9 6"/>'),
  CHEVRON_LEFT:  i('<polyline points="15 18 9 12 15 6"/>'),
  CHEVRON_DOWN:  i('<polyline points="6 9 12 15 18 9"/>'),

  // ── Étude ────────────────────────────────────────────────
  FLIP:   i('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15V9l3 3 3-3v6" stroke-width="1.5"/>'),
  MCQ:    i('<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>'),
  KEYBOARD: i('<rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="10" x2="6" y2="10"/><line x1="10" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="14" y2="10"/><line x1="18" y1="10" x2="18" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/>'),
  TARGET:   i('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'),
  TROPHY:   f('<path d="M6 2h12v6a6 6 0 0 1-12 0V2z" fill="#FF9F0A"/><path d="M6 8c-2 0-4-1-4-4h4" stroke="#FF9F0A" stroke-width="2" fill="none"/><path d="M18 8c2 0 4-1 4-4h-4" stroke="#FF9F0A" stroke-width="2" fill="none"/><rect x="9" y="14" width="6" height="2" fill="#FF9F0A"/><rect x="7" y="16" width="10" height="2" fill="#FF9F0A"/>'),
  THUMBSUP: f('<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" fill="#30D158"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" fill="#30D158"/>'),
  MUSCLE:   f('<path d="M18 3a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12z" fill="#0A84FF"/><path d="M12 8v13M8 11l4-3 4 3" stroke="#0A84FF" stroke-width="2" stroke-linecap="round" fill="none"/>'),

  // ── Contenu ──────────────────────────────────────────────
  DOC:   i('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>'),
  EXAM:  i('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'),
  ROCKET: i('<path d="M12 2s4 0 7 7c0 0-3 1-7 1s-7-1-7-1c3-7 7-7 7-7z"/><path d="M5 12s-2 4-2 7h18c0-3-2-7-2-7"/><circle cx="12" cy="10" r="1" fill="currentColor"/>'),
  MOON:   f('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#5AC8FA"/>'),
  SUN:    f('<circle cx="12" cy="12" r="5" fill="#FFD60A"/><line x1="12" y1="1" x2="12" y2="3" stroke="#FFD60A" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke="#FFD60A" stroke-width="2" stroke-linecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#FFD60A" stroke-width="2" stroke-linecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#FFD60A" stroke-width="2" stroke-linecap="round"/><line x1="1" y1="12" x2="3" y2="12" stroke="#FFD60A" stroke-width="2" stroke-linecap="round"/><line x1="21" y1="12" x2="23" y2="12" stroke="#FFD60A" stroke-width="2" stroke-linecap="round"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="#FFD60A" stroke-width="2" stroke-linecap="round"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="#FFD60A" stroke-width="2" stroke-linecap="round"/>'),
  HOUSE:  i('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'),

  // ── Matières (deck subjects) — Lucide Icons MIT ───────────
  //
  // SUBJECT_EN   : globe avec méridiens  → langue internationale
  // SUBJECT_LIT  : livre ouvert          → littérature
  // SUBJECT_ARG  : stylo / crayon        → rédaction / argumentation
  // SUBJECT_GEO  : globe plein           → géographie mondiale
  // SUBJECT_HIST : colonnes de temple    → histoire / antiquité
  //
  SUBJECT_EN: i(
    '<circle cx="12" cy="12" r="10"/>' +
    '<line x1="2" y1="12" x2="22" y2="12"/>' +
    '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'
  ),

  SUBJECT_LIT: i(
    '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>' +
    '<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'
  ),

  SUBJECT_ARG: i(
    '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>'
  ),

  SUBJECT_GEO: i(
    '<circle cx="12" cy="12" r="10"/>' +
    '<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>' +
    '<path d="M2 12h20"/>'
  ),

  SUBJECT_HIST: i(
    '<line x1="3" y1="22" x2="21" y2="22"/>' +
    '<line x1="6" y1="18" x2="6" y2="11"/>' +
    '<line x1="10" y1="18" x2="10" y2="11"/>' +
    '<line x1="14" y1="18" x2="14" y2="11"/>' +
    '<line x1="18" y1="18" x2="18" y2="11"/>' +
    '<polygon points="12 2 20 7 4 7"/>'
  ),

};

/**
 * Retourne un SVG redimensionné
 * @param {string} key   - clé dans icons
 * @param {number} size  - px (défaut 20)
 * @param {string} color - couleur CSS optionnelle (remplace currentColor)
 */
export function icon(key, size = 20, color) {
  let svg = icons[key] ?? icons.XMARK;
  if (size !== 20)  svg = svg.replace(/width="20" height="20"/g, `width="${size}" height="${size}"`);
  if (color)        svg = svg.replace(/stroke="currentColor"/g, `stroke="${color}"`);
  return svg;
}
