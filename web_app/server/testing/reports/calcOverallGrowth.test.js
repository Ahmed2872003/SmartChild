const { calcOverallGrowth } = require('../../utils/report.js');

describe('5. calcOverallGrowth()', () => {
  test('calculates the average step growth between consecutive reports across all 5 categories', () => {
    const mockReports = [
      {
        results: {
          memory: { averageAccuracy: 50 },
          iq: { averageAccuracy: 50 },
          reactionSpeed: { averageAccuracy: 50 },
          colorExplore: { averageAccuracy: 50 },
          hearing: { averageAccuracy: 50 },
        },
      }, // Session 1: Sum = 250. Avg = 50
      {
        results: {
          memory: { averageAccuracy: 60 },
          iq: { averageAccuracy: 60 },
          reactionSpeed: { averageAccuracy: 60 },
          colorExplore: { averageAccuracy: 60 },
          hearing: { averageAccuracy: 60 },
        },
      }, // Session 2: Sum = 300. Avg = 60
      {
        results: {
          memory: { averageAccuracy: 75 },
          iq: { averageAccuracy: 75 },
          reactionSpeed: { averageAccuracy: 75 },
          colorExplore: { averageAccuracy: 75 },
          hearing: { averageAccuracy: 75 },
        },
      }, // Session 3: Sum = 375. Avg = 75
    ];

    // Math Breakdown:
    // Step 1 Growth (Session 2 - Session 1): 60 - 50 = 10
    // Step 2 Growth (Session 3 - Session 2): 75 - 60 = 15
    // Total Step Growth = 25
    // Overall Growth (Total / 2 steps) = 12.5
    expect(calcOverallGrowth(mockReports)).toBe(12.5);
  });

  test('returns 0 if there are fewer than 2 reports', () => {
    expect(calcOverallGrowth([{ results: {} }])).toBe(0);
  });

  test('returns 0 if missing category metrics', () => {
    expect(
      calcOverallGrowth([
        {
          results: {
            memory: {}, // empty category metrics
          },
        },
        {
          results: {
            memory: {},
          },
        },
      ]),
    ).toBe(0);
  });
});
