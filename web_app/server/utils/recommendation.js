const { determineState } = require('./testEvaluation');

const { assessmentThresholds: thresholds } = require('../constants/thresholds');

const iqSubTests = Object.values(thresholds.IQ);

const aggregatedIqThresholds = {
  accuracy: {
    struggle: iqSubTests.reduce((sum, test) => sum + test.accuracy.struggle, 0) / iqSubTests.length,
    mastery: iqSubTests.reduce((sum, test) => sum + test.accuracy.mastery, 0) / iqSubTests.length,
  },
  responseTimeMs: {
    struggle: iqSubTests.reduce((sum, test) => sum + test.responseTimeMs.struggle, 0) / iqSubTests.length,
    mastery: iqSubTests.reduce((sum, test) => sum + test.responseTimeMs.mastery, 0) / iqSubTests.length,
  },
};

const formatList = (items) => {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
};

function generateGeneralRecommendation(reportResult) {
  const evaluations = [];

  const mappings = [
    { name: 'Memory', data: reportResult.memory, th: thresholds.Memory, accKey: 'accuracy', speedKey: 'latencyMs' },
    {
      name: 'Reaction Speed',
      data: reportResult.reactionSpeed,
      th: thresholds['Reaction Speed'],
      accKey: 'precision',
      speedKey: 'responseTimeMs',
    },
    {
      name: 'Color Exploration',
      data: reportResult.colorExplore,
      th: thresholds['Color Explore'],
      accKey: 'accuracy',
      speedKey: null,
    },
    {
      name: 'Hearing',
      data: reportResult.hearing,
      th: thresholds.Hearing,
      accKey: 'successRate',
      speedKey: 'latencyMs',
    },
    { name: 'IQ', data: reportResult.iq, th: aggregatedIqThresholds, accKey: 'accuracy', speedKey: 'responseTimeMs' },
  ];

  mappings.forEach((map) => {
    if (map.data && map.th) {
      const accState = determineState(
        map.data.averageAccuracy,
        map.th[map.accKey]?.struggle,
        map.th[map.accKey]?.mastery,
        true,
      );

      const speedState = map.speedKey
        ? determineState(map.data.averageSpeedMs, map.th[map.speedKey]?.struggle, map.th[map.speedKey]?.mastery, false)
        : null;

      if (accState !== null) evaluations.push({ trait: `${map.name} accuracy`, state: accState });
      if (speedState !== null) evaluations.push({ trait: `${map.name} speed`, state: speedState });
    }
  });

  // 4. Group results
  const struggles = evaluations.filter((e) => e.state === 'struggle').map((e) => e.trait.toLowerCase());
  const intermediates = evaluations.filter((e) => e.state === 'intermediate').map((e) => e.trait.toLowerCase());

  // 5. Generate the single parent-facing recommendation with dynamic grammar
  if (struggles.length > 0) {
    const traitList = formatList(struggles);
    const verb = struggles.length === 1 ? 'indicates' : 'indicate';
    const noun = struggles.length === 1 ? 'area' : 'areas';
    const pronoun = struggles.length === 1 ? 'this skill' : 'these skills';

    return `Focus Area Identified: Your child's ${traitList} currently ${verb} a potential ${noun} for support. Consider focusing their upcoming activities on ${pronoun} to help build confidence and proficiency.`;
  }

  if (intermediates.length > 0) {
    const traitList = formatList(intermediates);
    const verb = intermediates.length === 1 ? 'has' : 'have';

    return `Solid Baseline: Your child shows a good foundational understanding with no major weaknesses. However, their ${traitList} ${verb} room for growth. Encouraging further practice here will help them reach full mastery.`;
  }

  return `Exceptional Performance: Your child's accuracy and speed are in the mastery tier across all measured categories. They are ready for more challenging assessments to keep them engaged and growing.`;
}
module.exports = { generateGeneralRecommendation };
