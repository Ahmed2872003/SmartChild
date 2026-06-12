const { calculateStarDelta } = require('../../utils/testEvaluation');

describe('calculateStarDelta()', () => {
  describe('1. Drawing Test Override', () => {
    test('returns 2 stars immediately if it is a drawing test, ignoring difficulty and action', () => {
      expect(calculateStarDelta('level_up', 'hard', true)).toBe(2);
      expect(calculateStarDelta('level_down', 'easy', true)).toBe(2);
      expect(calculateStarDelta('maintain', 'medium', true)).toBe(2);
    });
  });

  describe('2. Winning Scenarios (Action is maintain or level_up)', () => {
    test('awards 7 stars for maintaining or levelling up on HARD', () => {
      expect(calculateStarDelta('maintain', 'hard', false)).toBe(7);
      expect(calculateStarDelta('level_up', 'hard', false)).toBe(7);
    });

    test('awards 5 stars for maintaining or levelling up on MEDIUM', () => {
      expect(calculateStarDelta('maintain', 'medium', false)).toBe(5);
      expect(calculateStarDelta('level_up', 'medium', false)).toBe(5);
    });

    test('awards 3 stars for maintaining or levelling up on EASY', () => {
      expect(calculateStarDelta('maintain', 'easy', false)).toBe(3);
      expect(calculateStarDelta('level_up', 'easy', false)).toBe(3);
    });
  });

  describe('3. Losing Scenarios (Action is level_down)', () => {
    test('deducts 3 stars for dropping from HARD', () => {
      expect(calculateStarDelta('level_down', 'hard', false)).toBe(-3);
    });

    test('deducts 2 stars for dropping from MEDIUM', () => {
      expect(calculateStarDelta('level_down', 'medium', false)).toBe(-2);
    });

    test('deducts 1 star for dropping from EASY', () => {
      expect(calculateStarDelta('level_down', 'easy', false)).toBe(-1);
    });
  });

  describe('4. Edge Cases and Defaults', () => {
    test('defaults to EASY difficulty if no difficulty is passed', () => {
      expect(calculateStarDelta('level_up', undefined, false)).toBe(3);
      expect(calculateStarDelta('level_down', undefined, false)).toBe(-1);
    });

    test('treats an unknown difficulty action as a win (not level_down)', () => {
      expect(calculateStarDelta(undefined, 'medium', false)).toBe(5);
    });
  });
});
