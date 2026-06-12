const { aggregateMetrices } = require('../../utils/report.js');

describe('aggregateMetrices()', () => {
  test('calculates weighted average accuracy and speed', () => {
    // Mocking the input structure expected from groupedByCategory
    const testsByCategory = {
      Memory: {
        overallDifficulty: 'hard',
        tests: [
          {
            difficulty: 'medium',
            results: { metrics: { AR: 80, ARL: 500 } },
            rawData: { totalSelections: 5 }, // combinedWeight: 1.5 * 5 = 7.5
          },
          {
            difficulty: 'hard',
            results: { metrics: { AR: 100, ARL: 300 } },
            rawData: { totalSelections: 10 }, // combinedWeight: 2 * 10 = 20
          },
        ],
      },
    };

    const result = aggregateMetrices(testsByCategory);

    // AR Calculation: ((80 * 7.5) + (100 * 20)) / 27.5 = 2600 / 27.5 = 94.55
    expect(result.memory.averageAccuracy).toBe(94.55);

    // Speed Calculation: (((500 / 1.5) * 5) + ((300 / 2) * 10)) / 27.5 = 56.25
    expect(result.memory.averageSpeedMs).toBe(115.15);
    expect(result.memory.overallDifficulty).toBe('hard');
  });

  test('handles missing difficulty, metrics, and rawData gracefully by falling back to 0 and 1', () => {
    const testsByCategory = {
      'Empty Tests': {
        overallDifficulty: 'easy',
        tests: [
          {
            // no difficulty
            results: { metrics: {} }, // Empty metrics
            rawData: null, // Empty raw data (no totalBugsSpawned, etc.)
          },
        ],
      },
    };

    const result = aggregateMetrices(testsByCategory);

    // Because metrics are empty, it should fall back to 0
    expect(result.emptyTests.averageAccuracy).toBe(0);
    expect(result.emptyTests.averageSpeedMs).toBe(0);
  });

  test('returns 0 for averages if the total combined weight is 0 (empty test array)', () => {
    const testsByCategory = {
      'Ghost Category': {
        overallDifficulty: 'easy',
        tests: [], // Empty array
      },
    };

    const result = aggregateMetrices(testsByCategory);

    expect(result.ghostCategory.averageAccuracy).toBe(0);
    expect(result.ghostCategory.averageSpeedMs).toBe(0);
  });
});
