/**
 * SM-2 Algorithm (SuperMemo 2)
 * @param {Object} card - état actuel de la carte
 * @param {number} grade - note de 0 à 5
 *   0 = blackout total
 *   3 = difficile mais correct
 *   4 = correct
 *   5 = parfait
 * @returns {Object} nouvel état de la carte
 */
export function sm2(card, grade) {
  let interval    = card.interval     ?? 1;
  let easeFactor  = card.easeFactor   ?? 2.5;
  let repetitions = card.repetitions  ?? 0;

  if (grade >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval    = 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const now        = new Date();
  const nextReview = new Date(now);
  nextReview.setDate(now.getDate() + interval);

  return {
    interval,
    easeFactor:   Math.round(easeFactor * 100) / 100,
    repetitions,
    nextReview:   nextReview.toISOString().split('T')[0],
    lastReview:   now.toISOString().split('T')[0],
  };
}

/**
 * Vérifie si une carte est due aujourd'hui ou en retard
 * @param {string} nextReview - date YYYY-MM-DD
 * @returns {boolean}
 */
export function isDue(nextReview) {
  if (!nextReview) return true;
  const today = new Date().toISOString().split('T')[0];
  return nextReview <= today;
}

/**
 * Compte les cartes dues dans un deck
 * @param {Array}  cards    - cartes du deck
 * @param {Object} progress - { [cardId]: { nextReview } }
 * @returns {number}
 */
export function countDue(cards, progress) {
  return cards.filter(c => isDue(progress[c.id]?.nextReview)).length;
}
