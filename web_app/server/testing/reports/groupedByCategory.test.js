const { groupedByCategory } = require('../../utils/report.js');

describe('groupedByCategory()', () => {
  test('groups tests by category and identifies the highest overall difficulty', () => {
    const mockTests = [
      { test_id: { category_id: { name: 'Memory' } }, difficulty: 'easy' },
      { test_id: { category_id: { name: 'Memory' } }, difficulty: 'hard' },
      { test_id: { category_id: { name: 'Reaction Speed' } }, difficulty: 'medium' },
    ];

    const result = groupedByCategory(mockTests);

    // Check grouping
    expect(result.Memory.tests.length).toBe(2);
    expect(result['Reaction Speed'].tests.length).toBe(1);

    // Check peak difficulty logic (Hard > Easy)
    expect(result.Memory.overallDifficulty).toBe('hard');
    expect(result['Reaction Speed'].overallDifficulty).toBe('medium');
  });

  test('defaults to "easy" if the difficulty property is missing or undefined', () => {
    const mockTests = [{ test_id: { category_id: { name: 'Memory' } } }];

    const result = groupedByCategory(mockTests);

    expect(result.Memory.overallDifficulty).toBe('easy');
  });
});
