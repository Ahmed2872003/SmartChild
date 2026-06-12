const { assessmentThresholds: thresholds } = require('../constants/thresholds.js');

const weights = require('../constants/weights.js');

const determineState = (value, struggleLimit, masteryLimit, isHigherBetter = true) => {
  if (isHigherBetter) {
    if (value < struggleLimit) return 'struggle';
    if (value >= masteryLimit) return 'mastery';
    return 'intermediate';
  } else {
    // For metrics like Time or Latency, a lower number is better
    if (value > struggleLimit) return 'struggle';
    if (value <= masteryLimit) return 'mastery';
    return 'intermediate';
  }
};

const getDifficultyAction = (states) => {
  if (states.includes('struggle')) return 'level_down';
  if (states.every((state) => state === 'mastery')) return 'level_up';
  return 'maintain';
};

const evaluateMemory = (rawData) => {
  const total = rawData.totalSelections || 1;
  const AR = (rawData.correctRecalls / total) * 100;
  const ARL = rawData.sumOfRecallLatenciesMs / total;

  const limits = thresholds.Memory;

  const arState = determineState(AR, limits.accuracy.struggle, limits.accuracy.mastery, true);
  const arlState = determineState(ARL, limits.latencyMs.struggle, limits.latencyMs.mastery, false);

  const difficultyAction = getDifficultyAction([arState, arlState]);

  return { metrics: { AR, ARL }, difficultyAction };
};

const evaluateReactionSpeed = (rawData) => {
  const hits = rawData.successfulHits || 1;
  const total = rawData.totalBugsSpawned || rawData.totalSelections || 1;

  const MRT = rawData.sumOfResponseTimesMs / hits;
  const PI = (hits / total) * 100;

  const limits = thresholds['Reaction Speed'];

  const mrtState = determineState(MRT, limits.responseTimeMs.struggle, limits.responseTimeMs.mastery, false);
  const piState = determineState(PI, limits.precision.struggle, limits.precision.mastery, true);

  const difficultyAction = getDifficultyAction([mrtState, piState]);

  return { metrics: { MRT, PI }, difficultyAction };
};

const evaluateColorExplore = (rawData) => {
  const total = rawData.totalSelections || 1;
  const AR = (rawData.correctIdentifications / total) * 100;

  const redProfile = rawData.Red ? (rawData.Red.hits / (rawData.Red.prompts || 1)) * 100 : 0;
  const greenProfile = rawData.Green ? (rawData.Green.hits / (rawData.Green.prompts || 1)) * 100 : 0;
  const blueProfile = rawData.Blue ? (rawData.Blue.hits / (rawData.Blue.prompts || 1)) * 100 : 0;

  const limits = thresholds['Color Explore'];

  const arState = determineState(AR, limits.accuracy.struggle, limits.accuracy.mastery, true);

  const redState = determineState(redProfile, limits.rgbProfile.struggle, limits.rgbProfile.mastery, true);
  const greenState = determineState(greenProfile, limits.rgbProfile.struggle, limits.rgbProfile.mastery, true);
  const blueState = determineState(blueProfile, limits.rgbProfile.struggle, limits.rgbProfile.mastery, true);

  const difficultyAction = getDifficultyAction([arState, redState, greenState, blueState]);

  return {
    metrics: { AR, profiles: { Red: redProfile, Green: greenProfile, Blue: blueProfile } },
    difficultyAction,
  };
};

const evaluateHearing = (rawData) => {
  const total = rawData.totalSoundsPlayed || 1;
  const ISR = (rawData.correctIdentifications / total) * 100;
  const AARL = rawData.sumOfAudioResponseLatenciesMs / total;

  const limits = thresholds.Hearing;

  const isrState = determineState(ISR, limits.successRate.struggle, limits.successRate.mastery, true);
  const aarlState = determineState(AARL, limits.latencyMs.struggle, limits.latencyMs.mastery, false);

  const difficultyAction = getDifficultyAction([isrState, aarlState]);

  return { metrics: { ISR, AARL }, difficultyAction };
};

const evaluateIQ = (testName, rawData) => {
  let AR = 0;
  let ART = 0;

  if (rawData.optimalMoves !== undefined) {
    const total = rawData.totalMoves || 1;
    AR = (rawData.optimalMoves / total) * 100;
    ART = rawData.timeTakenMs / total;
  } else {
    const total = rawData.totalRounds || 1;
    AR = (rawData.correctIdentifications / total) * 100;
    ART = rawData.timeTakenMs / total;
  }

  const limits = thresholds.IQ[testName];

  const arState = determineState(AR, limits.accuracy.struggle, limits.accuracy.mastery, true);
  const artState = determineState(ART, limits.responseTimeMs.struggle, limits.responseTimeMs.mastery, false);

  const difficultyAction = getDifficultyAction([arState, artState]);

  return { metrics: { AR, ART }, difficultyAction };
};

const evaluateMetrices = (assessmentTest) => {
  const categoryName = assessmentTest.test_id.category_id.name;
  const rawData = assessmentTest.rawData;
  let evaluationResult = null;

  switch (categoryName) {
    case 'Memory':
      evaluationResult = evaluateMemory(rawData);
      break;
    case 'Reaction Speed':
      evaluationResult = evaluateReactionSpeed(rawData);
      break;
    case 'Color Explore':
      evaluationResult = evaluateColorExplore(rawData);
      break;
    case 'Hearing':
      evaluationResult = evaluateHearing(rawData);
      break;
    case 'IQ':
      evaluationResult = evaluateIQ(assessmentTest.test_id.name, rawData);
      break;
    case 'Art':
      evaluationResult = { metrics: { image: rawData.image }, difficultyAction: 'maintain' };
      break;
    default:
      throw new Error(`Unknown category: ${categoryName}`);
  }

  return {
    ...evaluationResult,
  };
};

const calculateStarDelta = (difficultyAction, currentDifficulty = 'easy', isDrawingTest = false) => {
  if (isDrawingTest) return 2;

  const isGoodGame = difficultyAction !== 'level_down';

  const winScores = { hard: 7, medium: 5, easy: 3 };
  const loseScores = { hard: -3, medium: -2, easy: -1 };

  const level = currentDifficulty || 'easy';

  return isGoodGame ? winScores[level] : loseScores[level];
};

const calculateNewDifficulty = (prevDifficulty = 'easy', action = 'maintain') => {
  const levels = ['easy', 'medium', 'hard'];
  let currentIndex = Math.max(0, levels.indexOf(prevDifficulty));

  if (action === 'level_up') currentIndex = Math.min(currentIndex + 1, 2);
  if (action === 'level_down') currentIndex = Math.max(currentIndex - 1, 0);

  return levels[currentIndex];
};

const buildAdaptiveTestsPayload = (allTests, previousTests, newAssessmentId) => {
  const prevMap = previousTests.reduce((acc, test) => {
    const testIdStr = test.test_id?._id?.toString() || test.test_id?.toString();
    if (testIdStr) {
      acc[testIdStr] = { difficulty: test.difficulty, action: test.results?.difficultyAction };
    }
    return acc;
  }, {});

  return allTests.map((test) => {
    const prevTestInfo = prevMap[test._id.toString()];
    const targetDifficulty = prevTestInfo
      ? calculateNewDifficulty(prevTestInfo.difficulty, prevTestInfo.action)
      : 'easy';

    return {
      assessment_id: newAssessmentId,
      test_id: test._id,
      difficulty: targetDifficulty,
      isCompleted: false,
      starsEarned: 0,
    };
  });
};

module.exports = {
  evaluateMetrices,
  calculateStarDelta,
  calculateNewDifficulty,
  buildAdaptiveTestsPayload,
  determineState,
  getDifficultyAction,
};
