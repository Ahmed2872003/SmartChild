const { getOverallFeeling } = require('../../utils/report.js');

describe('4. getOverallFeeling()', () => {
  test('returns the most frequent emotion', () => {
    const mockDrawingTests = [
      { results: { metrics: { classification: { emotion: 'happy' } } } },
      { results: { metrics: { classification: { emotion: 'happy' } } } },
      { results: { metrics: { classification: { emotion: 'sad' } } } },
    ];

    const result = getOverallFeeling(mockDrawingTests);
    expect(result.overallFeeling).toBe('happy');
    expect(result.emotionsFreq.happy).toBe(2);
  });

  test('breaks ties by picking the most recent (last in array) emotion', () => {
    const mockDrawingTests = [
      { results: { metrics: { classification: { emotion: 'sad' } } } }, // Oldest
      { results: { metrics: { classification: { emotion: 'happy' } } } },
      { results: { metrics: { classification: { emotion: 'sad' } } } },
      { results: { metrics: { classification: { emotion: 'happy' } } } }, // Newest (Tie-breaker)
    ];

    const result = getOverallFeeling(mockDrawingTests);
    expect(result.overallFeeling).toBe('happy');
  });

  test('handles empty or missing arrays gracefully', () => {
    const result = getOverallFeeling([]);
    expect(result.overallFeeling).toBe('N/A');
  });
});
