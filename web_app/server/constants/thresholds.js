const assessmentThresholds = {
  Memory: {
    accuracy: { struggle: 55, mastery: 75 },
    latencyMs: { struggle: 3500, mastery: 1800 },
  },
  ['Reaction Speed']: {
    precision: { struggle: 50, mastery: 85 },
    responseTimeMs: { struggle: 1000, mastery: 600 },
  },
  ['Color Explore']: {
    accuracy: { struggle: 65, mastery: 85 },
    rgbProfile: { struggle: 40, mastery: 60 },
  },
  Hearing: {
    successRate: { struggle: 60, mastery: 80 },
    latencyMs: { struggle: 3000, mastery: 1500 },
  },
  IQ: {
    'Odd One Out': {
      accuracy: { struggle: 60, mastery: 80 },
      responseTimeMs: { struggle: 7000, mastery: 3000 },
    },
    Puzzle: {
      accuracy: { struggle: 60, mastery: 80 },
      responseTimeMs: { struggle: 90_000, mastery: 45_000 },
    },
  },
};

const metricThresholds = {
  accuracy: { struggle: 60, pass: 80 },
  latency: { struggle: undefined, pass: undefined },
};

module.exports = { assessmentThresholds };
