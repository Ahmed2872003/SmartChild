const { evaluateMetrices } = require('../../utils/testEvaluation');

describe('evaluateMetrices() - All Game Categories', () => {
  test('Memory: calculates AR and ARL correctly and assigns "level_up" for perfect mastery', () => {
    const mockAssessment = {
      test_id: { category_id: { name: 'Memory' } },
      rawData: {
        totalSelections: 10,
        correctRecalls: 8, // AR = 80%
        sumOfRecallLatenciesMs: 5000, // ARL = 500ms
      },
    };

    const result = evaluateMetrices(mockAssessment);

    expect(result.metrics.AR).toBe(80);
    expect(result.metrics.ARL).toBe(500);

    // AR (80) >= mastery (75) -> 'mastery'
    // ARL (500) <= mastery (1800) -> 'mastery'
    // All states are mastery, so it must level up.
    expect(result.difficultyAction).toBe('level_up');
  });

  test('Reaction Speed: calculates MRT and PI, assigning "maintain" for mixed performance', () => {
    const mockAssessment = {
      test_id: { category_id: { name: 'Reaction Speed' } },
      rawData: {
        successfulHits: 5,
        totalBugsSpawned: 10,
        sumOfResponseTimesMs: 2500,
      },
    };
    const result = evaluateMetrices(mockAssessment);

    expect(result.metrics.MRT).toBe(500); // 500ms
    expect(result.metrics.PI).toBe(50); // 50%

    // MRT (500) <= mastery (600) -> 'mastery'
    // PI (50) is not < struggle (50), but not >= mastery (85) -> 'intermediate'
    // Mixed states without struggle results in maintaining.
    expect(result.difficultyAction).toBe('maintain');
  });

  test('Color Explore: assigns "level_down" because Green profile is struggling', () => {
    const mockAssessment = {
      test_id: { category_id: { name: 'Color Explore' } },
      rawData: {
        totalSelections: 10,
        correctIdentifications: 7, // Overall AR = 70%
        Red: { hits: 2, prompts: 2 }, // 100%
        Green: { hits: 1, prompts: 4 }, // 25%
        Blue: { hits: 4, prompts: 4 }, // 100%
      },
    };
    const result = evaluateMetrices(mockAssessment);

    expect(result.metrics.AR).toBe(70);
    expect(result.metrics.profiles.Red).toBe(100);
    expect(result.metrics.profiles.Green).toBe(25);
    expect(result.metrics.profiles.Blue).toBe(100);

    // Green (25) < rgbProfile struggle limit (40) -> 'struggle'
    // A single struggle state overrides everything else.
    expect(result.difficultyAction).toBe('level_down');
  });

  test('Hearing: assigns "level_up" for meeting all mastery thresholds', () => {
    const mockAssessment = {
      test_id: { category_id: { name: 'Hearing' } },
      rawData: {
        totalSoundsPlayed: 5,
        correctIdentifications: 4, // ISR = 80%
        sumOfAudioResponseLatenciesMs: 4000, // AARL = 800ms
      },
    };
    const result = evaluateMetrices(mockAssessment);

    expect(result.metrics.ISR).toBe(80);
    expect(result.metrics.AARL).toBe(800);

    // ISR (80) >= mastery limit (80) -> 'mastery'
    // AARL (800) <= mastery limit (1500) -> 'mastery'
    expect(result.difficultyAction).toBe('level_up');
  });

  test('IQ (Odd One Out): assigns "maintain" for fast time but intermediate accuracy', () => {
    const mockAssessment = {
      test_id: {
        name: 'Odd One Out',
        category_id: { name: 'IQ' },
      },
      rawData: {
        correctIdentifications: 8, // AR = 80%
        totalRounds: 10,
        timeTakenMs: 25000, // ART = 2500ms
      },
    };

    const result = evaluateMetrices(mockAssessment);

    expect(result.metrics.AR).toBe(80);
    expect(result.metrics.ART).toBe(2500);

    // AR (80) >= mastery (80) -> 'mastery'
    // ART (2500) is between struggle (4000) and mastery (1500) -> 'intermediate'
    expect(result.difficultyAction).toBe('maintain');
  });

  test('IQ (Puzzle): assigns "level_down" due to struggling accuracy', () => {
    const mockAssessment = {
      test_id: {
        name: 'Puzzle',
        category_id: { name: 'IQ' },
      },
      rawData: {
        optimalMoves: 5, // AR = 50%
        totalMoves: 10,
        timeTakenMs: 600000, // ART = 60,000ms
      },
    };

    const result = evaluateMetrices(mockAssessment);

    expect(result.metrics.AR).toBe(50);
    expect(result.metrics.ART).toBe(60000);

    // AR (50) < struggle limit (60) -> 'struggle'
    // ART (60000) is between limits -> 'intermediate'
    // The single struggle on accuracy forces a level down.
    expect(result.difficultyAction).toBe('level_down');
  });
});
