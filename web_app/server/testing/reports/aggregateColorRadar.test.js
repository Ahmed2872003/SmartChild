const { aggregateColorRadar } = require('../../utils/report.js');

describe('aggregateColorRadar()', () => {
  test('accumulates and calculates correctly across multiple test sessions with varying difficulties', () => {
    const mockTests = [
      {
        difficulty: 'easy', // weight: 1.0
        results: { metrics: { profiles: { Red: 50, Green: 60, Blue: 70 } } },
        rawData: {
          Red: { prompts: 2 }, // combinedWeight = 1.0 * 2 = 2
          Green: { prompts: 2 }, // combinedWeight = 1.0 * 2 = 2
          Blue: { prompts: 2 }, // combinedWeight = 1.0 * 2 = 2
        },
      },
      {
        difficulty: 'hard', // weight: 2.0
        results: { metrics: { profiles: { Red: 100, Green: 20, Blue: 10 } } },
        rawData: {
          Red: { prompts: 3 }, // combinedWeight = 2.0 * 3 = 6
          Green: { prompts: 1 }, // combinedWeight = 2.0 * 1 = 2
          Blue: { prompts: 4 }, // combinedWeight = 2.0 * 4 = 8
        },
      },
    ];

    const result = aggregateColorRadar(mockTests);

    // Red Math:
    // Test 1: (50 * 2) = 100
    // Test 2: (100 * 6) = 600
    // Total Score: 700. Total Weight: 8. (700 / 8 = 87.5 -> rounded to 88)
    expect(result.red).toBe(88);

    // Green Math:
    // Test 1: (60 * 2) = 120
    // Test 2: (20 * 2) = 40
    // Total Score: 160. Total Weight: 4. (160 / 4 = 40 -> rounded to 40)
    expect(result.green).toBe(40);

    // Blue Math:
    // Test 1: (70 * 2) = 140
    // Test 2: (10 * 8) = 80
    // Total Score: 220. Total Weight: 10. (220 / 10 = 22 -> rounded to 22)
    expect(result.blue).toBe(22);
  });

  test('returns 0 for colors with no prompts', () => {
    const result = aggregateColorRadar([]);

    expect(result.red).toBe(0);
    expect(result.green).toBe(0);
    expect(result.blue).toBe(0);
  });

  test('handles missing difficulty, profiles, and rawData gracefully', () => {
    const mockTests = [
      {
        // Missing difficulty entirely (falls back to 1)
        // Missing results/profiles entirely (safely bypasses the if statement)
        rawData: { Red: { prompts: 5 } },
      },
      {
        difficulty: 'easy',
        results: { metrics: { profiles: { Red: 50 } } },
        // Missing rawData entirely
      },
    ];

    const result = aggregateColorRadar(mockTests);

    expect(result.red).toBe(0);
    expect(result.green).toBe(0);
    expect(result.blue).toBe(0);
  });
});
