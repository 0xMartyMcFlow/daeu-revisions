import { isDue } from './sm2.js';

const KEYS = {
  PROGRESS : 'daeu_progress',
  STATS    : 'daeu_stats',
  SETTINGS : 'daeu_settings',
  SESSION  : 'daeu_session',
};

// ── HELPERS ──────────────────────────────────────────────

function load(key, fallback = {}) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[store] localStorage write failed:', e);
  }
}

// ── PROGRESS SRS ─────────────────────────────────────────

export function getProgress() {
  return load(KEYS.PROGRESS);
}

export function saveCardResult(cardId, sm2Result) {
  const progress = getProgress();
  progress[cardId] = sm2Result;
  save(KEYS.PROGRESS, progress);
}

export function getCardState(cardId) {
  return getProgress()[cardId] ?? null;
}

export function getDueCards(cards) {
  const progress = getProgress();
  return cards.filter(c => isDue(progress[c.id]?.nextReview));
}

export function resetDeck(deckId, cards) {
  const progress = getProgress();
  cards.forEach(c => { delete progress[c.id]; });
  save(KEYS.PROGRESS, progress);
}

// ── STATS QUOTIDIENNES ────────────────────────────────────

export function getStats() {
  return load(KEYS.STATS);
}

export function incrementToday(n = 1) {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];
  stats[today] = (stats[today] ?? 0) + n;
  save(KEYS.STATS, stats);
}

export function getTodayCount() {
  const today = new Date().toISOString().split('T')[0];
  return getStats()[today] ?? 0;
}

export function getStreak() {
  const stats = getStats();
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().split('T')[0];
    if (!stats[key]) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function getLast7Days() {
  const stats = getStats();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    return { date: key, count: stats[key] ?? 0 };
  });
}

// ── SETTINGS ─────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  theme        : 'dark',
  dailyGoal    : 20,
  notifications: false,
  showTimer    : true,
  autoFlip     : false,
};

export function getSettings() {
  return { ...DEFAULT_SETTINGS, ...load(KEYS.SETTINGS) };
}

export function saveSetting(key, value) {
  const settings = getSettings();
  settings[key] = value;
  save(KEYS.SETTINGS, settings);
}

// ── SESSION EXAM ──────────────────────────────────────────

export function saveSession(data) {
  save(KEYS.SESSION, data);
}

export function getSession() {
  return load(KEYS.SESSION, null);
}

// ── EXPORT TOTAL (debug / backup) ────────────────────────

export function exportAll() {
  return {
    progress : getProgress(),
    stats    : getStats(),
    settings : getSettings(),
    session  : getSession(),
  };
}

export function clearAll() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}
