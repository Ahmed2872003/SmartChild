const { calculateNewDifficulty } = require('../../utils/testEvaluation');

describe('calculateNewDifficulty()', () => {
  test('increases difficulty from easy to medium on level_up', () => {
    expect(calculateNewDifficulty('easy', 'level_up')).toBe('medium');
  });

  test('caps difficulty at "hard" even if level_up is triggered', () => {
    expect(calculateNewDifficulty('hard', 'level_up')).toBe('hard');
  });

  test('decreases difficulty from medium to easy on level_down', () => {
    expect(calculateNewDifficulty('medium', 'level_down')).toBe('easy');
  });

  test('bottoms out at "easy" even if level_down is triggered', () => {
    expect(calculateNewDifficulty('easy', 'level_down')).toBe('easy');
  });

  test('keeps the exact same difficulty when action is "maintain"', () => {
    expect(calculateNewDifficulty('medium', 'maintain')).toBe('medium');
  });
});
