const weights = require('../constants/weights');

const categories = ['memory', 'reactionSpeed', 'colorExplore', 'hearing', 'iq'];

const groupedByCategory = (assessmentTests) => {
  const grouped = assessmentTests.reduce((acc, test) => {
    const categoryName = test.test_id.category_id.name;

    if (!acc[categoryName]) acc[categoryName] = [];

    acc[categoryName].push(test);

    return acc;
  }, {});

  const finalResult = {};

  for (const [categoryName, testsArray] of Object.entries(grouped)) {
    let peakDifficulty = 'easy';

    testsArray.forEach((test) => {
      const currentDiff = test.difficulty?.toLowerCase() || 'easy';

      if (weights[currentDiff] > weights[peakDifficulty]) {
        peakDifficulty = currentDiff;
      }
    });

    finalResult[categoryName] = {
      overallDifficulty: peakDifficulty,
      tests: testsArray,
    };
  }

  return finalResult;
};

const aggregateMetrices = (testsByCategory) =>
  Object.keys(testsByCategory).reduce((acc, categoryName) => {
    const testsInCategory = testsByCategory[categoryName].tests;

    let sumWeightedAccuracy = 0;
    let sumWeightedSpeed = 0;
    let totalCombinedWeight = 0;

    testsInCategory.forEach((test) => {
      const metrics = test.results?.metrics;
      const rawData = test.rawData || {};
      const diffWeight = weights[test.difficulty?.toLowerCase()] || 1.0;

      const promptCount =
        rawData.totalBugsSpawned ||
        rawData.optimalMoves ||
        rawData.totalSoundsPlayed ||
        rawData.totalRounds ||
        rawData.totalSelections ||
        1;

      const combinedWeight = diffWeight * promptCount;

      const rawAccuracy = parseFloat(metrics.AR || metrics.ISR || metrics.PI || 0);
      sumWeightedAccuracy += rawAccuracy * combinedWeight;

      const rawSpeed = parseFloat(metrics.ART || metrics.ARL || metrics.AARL || metrics.MRT || 0);
      sumWeightedSpeed += (rawSpeed / diffWeight) * promptCount;

      totalCombinedWeight += combinedWeight;
    });

    const spaceSplitCategory = categoryName.split(' ');
    const camelCaseKey = spaceSplitCategory[0].toLocaleLowerCase() + (spaceSplitCategory[1] || '');

    acc[camelCaseKey] = {
      averageAccuracy: totalCombinedWeight > 0 ? parseFloat((sumWeightedAccuracy / totalCombinedWeight).toFixed(2)) : 0,

      averageSpeedMs: totalCombinedWeight > 0 ? parseFloat((sumWeightedSpeed / totalCombinedWeight).toFixed(2)) : 0,

      overallDifficulty: testsByCategory[categoryName].overallDifficulty,
    };

    return acc;
  }, {});
const aggregateColorRadar = (tests) => {
  const totals = {
    Red: { weightedScore: 0, totalWeight: 0 },
    Green: { weightedScore: 0, totalWeight: 0 },
    Blue: { weightedScore: 0, totalWeight: 0 },
  };

  tests.forEach((doc) => {
    const diffWeight = weights[doc.difficulty] || 1;
    const profiles = doc.results?.metrics?.profiles;
    const rawData = doc.rawData;

    if (profiles && rawData) {
      ['Red', 'Green', 'Blue'].forEach((color) => {
        if (profiles[color] !== undefined && rawData[color] && rawData[color].prompts > 0) {
          const promptCount = rawData[color].prompts;

          const combinedWeight = promptCount * diffWeight;

          totals[color].weightedScore += profiles[color] * combinedWeight;

          totals[color].totalWeight += combinedWeight;
        }
      });
    }
  });

  return {
    red: totals.Red.totalWeight > 0 ? Math.round(totals.Red.weightedScore / totals.Red.totalWeight) : 0,
    green: totals.Green.totalWeight > 0 ? Math.round(totals.Green.weightedScore / totals.Green.totalWeight) : 0,
    blue: totals.Blue.totalWeight > 0 ? Math.round(totals.Blue.weightedScore / totals.Blue.totalWeight) : 0,
  };
};

const getOverallFeeling = (drawingTests) => {
  if (!drawingTests || drawingTests.length === 0) {
    return { emotionsFreq: {}, overallFeeling: 'N/A' };
  }

  const emotionsFreq = drawingTests.reduce((acc, { results }) => {
    const emotion = results.metrics.classification.emotion;
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {});

  const maxFreq = Math.max(...Object.values(emotionsFreq));

  const tiedEmotions = Object.keys(emotionsFreq).filter((emotion) => emotionsFreq[emotion] === maxFreq);

  let overallFeeling;

  if (tiedEmotions.length > 1) {
    for (let i = drawingTests.length - 1; i >= 0; i--) {
      const emotion = drawingTests[i].results.metrics.classification.emotion;
      if (tiedEmotions.includes(emotion)) {
        overallFeeling = emotion;
        break;
      }
    }
  } else {
    overallFeeling = tiedEmotions[0];
  }

  return { emotionsFreq, overallFeeling };
};

const calcOverallGrowth = (reports) => {
  if (reports.length < 2) return 0;

  const sessionScores = reports.map((report) => {
    const sum = categories.reduce((acc, cat) => {
      return acc + (report.results[cat]?.averageAccuracy || 0);
    }, 0);
    return sum / categories.length;
  });

  let totalStepGrowth = 0;
  for (let i = 1; i < sessionScores.length; i++) {
    totalStepGrowth += sessionScores[i] - sessionScores[i - 1];
  }

  const overall_growth = totalStepGrowth / (sessionScores.length - 1);

  return Number(overall_growth.toFixed(2));
};

const calcReportsAvg = (reports) => {
  if (!reports || !Array.isArray(reports) || reports.length === 0) return undefined;

  const totals = {};
  categories.forEach((cat) => {
    totals[cat] = { sumAccuracy: 0, sumSpeed: 0, count: 0 };
  });

  reports.forEach((report) => {
    const results = report.results;
    if (!results) return;

    categories.forEach((cat) => {
      if (results[cat]) {
        totals[cat].sumAccuracy += results[cat].averageAccuracy || 0;
        totals[cat].sumSpeed += results[cat].averageSpeedMs || 0;
        totals[cat].count += 1;
      }
    });
  });

  const combinedResults = {};

  categories.forEach((cat) => {
    if (totals[cat].count > 0) {
      combinedResults[cat] = {
        averageAccuracy: Number((totals[cat].sumAccuracy / totals[cat].count).toFixed(2)),
        averageSpeedMs: Number((totals[cat].sumSpeed / totals[cat].count).toFixed(2)),
      };
    }
  });

  return combinedResults;
};

const formatOverallReport = (report) =>
  report
    ? `Overall growth: ${report.overall_growth_percentage}% | Emotional state: ${report.overall_feeling} | Recommendation: ${report.overall_system_recommendation}`
    : '';

module.exports = {
  aggregateColorRadar,
  getOverallFeeling,
  calcOverallGrowth,
  groupedByCategory,
  aggregateMetrices,
  calcReportsAvg,
  formatOverallReport,
};
