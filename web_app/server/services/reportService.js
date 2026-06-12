const { DailyReportModel } = require('../models/index');

const weights = require('../constants/weights');
const reportUtil = require('../utils/report');
const { generateGeneralRecommendation } = require('../utils/recommendation');

const generateReport = async (assessment, assessmentTests) => {
  const testsByCategory = reportUtil.groupedByCategory(assessmentTests);
  const artResults = testsByCategory['Art'].tests[0].results.metrics;

  delete testsByCategory.Art;

  const aggregatedMetrices = reportUtil.aggregateMetrices(testsByCategory);

  aggregatedMetrices.art = artResults;

  try {
    await DailyReportModel.create({
      assessment_id: assessment._id,
      system_recommendation: generateGeneralRecommendation(aggregatedMetrices),
      results: aggregatedMetrices,
    });
  } catch (err) {
    process.env.NODE_ENV === 'development' && console.log(err);
  }
};

module.exports = { generateReport };
