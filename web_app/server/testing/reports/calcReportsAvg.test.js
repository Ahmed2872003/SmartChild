const { calcReportsAvg } = require('../../utils/report.js');

describe('calcReportsAvg()', () => {
  test('averages metrics across multiple reports', () => {
    const mockReports = [
      {
        results: {
          memory: { averageAccuracy: 60, averageSpeedMs: 1000 },
          iq: { averageAccuracy: 20, averageSpeedMs: 500 },
        },
      },
      {
        results: {
          memory: { averageAccuracy: 80, averageSpeedMs: 500 },
          iq: { averageAccuracy: 20, averageSpeedMs: 500 },
        },
      },
    ];

    const result = calcReportsAvg(mockReports);

    // Accuracy: (60 + 80) / 2 = 70
    expect(result.memory.averageAccuracy).toBe(70);
    // Speed: (1000 + 500) / 2 = 750
    expect(result.memory.averageSpeedMs).toBe(750);

    // iq: (20 + 20) / 2 = 20
    expect(result.iq.averageAccuracy).toBe(20);
    // iq: (500 + 500) / 2 = 500
    expect(result.iq.averageSpeedMs).toBe(500);
  });

  test('returns undefined for empty or invalid input', () => {
    expect(calcReportsAvg([])).toBeUndefined();
    expect(calcReportsAvg(null)).toBeUndefined();
  });

  test('handles missing results objects and missing metric values (fallbacks to 0)', () => {
    const mockReports = [
      {}, // Completely empty report (triggers: if (!results) return;)
      {
        results: {
          memory: {}, // Has the category, but missing averageAccuracy and averageSpeedMs
        },
      },
    ];

    const result = calcReportsAvg(mockReports);

    expect(result.memory.averageAccuracy).toBe(0);
    expect(result.memory.averageSpeedMs).toBe(0);
  });
});
