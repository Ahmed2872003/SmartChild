const { getDifficultyAction } = require('../../utils/testEvaluation');

describe('getDifficultyAction()', () => {
  describe('1. The "Struggle" Priority (Returns level_down)', () => {
    test('returns "level_down" if there is a single struggle state', () => {
      expect(getDifficultyAction(['struggle'])).toBe('level_down');
    });

    test('returns "level_down" even if there are mastery states present (struggle overrides)', () => {
      expect(getDifficultyAction(['mastery', 'intermediate', 'struggle'])).toBe('level_down');
    });
  });

  describe('2. The "Mastery" Requirement (Returns level_up)', () => {
    test('returns "level_up" ONLY if every single state is mastery', () => {
      expect(getDifficultyAction(['mastery', 'mastery', 'mastery'])).toBe('level_up');
    });
  });

  describe('3. The "Maintain" Fallback', () => {
    test('returns "maintain" if all states are intermediate', () => {
      expect(getDifficultyAction(['intermediate', 'intermediate'])).toBe('maintain');
    });

    test('returns "maintain" for a mix of mastery and intermediate (with NO struggle)', () => {
      expect(getDifficultyAction(['mastery', 'intermediate', 'mastery'])).toBe('maintain');
    });
  });
});
