const { determineState } = require('../../utils/testEvaluation');

describe('determineState()', () => {
  // Testing when a HIGHER score is better
  describe('When higher is better', () => {
    test('returns "struggle" if value is below struggle limit', () => {
      expect(determineState(40, 50, 80, true)).toBe('struggle');
    });

    test('returns "intermediate" if value is between limits', () => {
      expect(determineState(65, 50, 80, true)).toBe('intermediate');
    });

    test('returns "mastery" if value is at or above mastery limit', () => {
      expect(determineState(85, 50, 80, true)).toBe('mastery');
    });
  });

  // Testing when a LOWER score is better
  describe('When lower is better', () => {
    test('returns "struggle" if time is higher than struggle limit', () => {
      expect(determineState(1200, 1000, 500, false)).toBe('struggle');
    });

    test('returns "intermediate" if value is between limits', () => {
      expect(determineState(600, 1000, 500, false)).toBe('intermediate');
    });

    test('returns "mastery" if time is faster (lower) than mastery limit', () => {
      expect(determineState(400, 1000, 500, false)).toBe('mastery');
    });
  });
});
