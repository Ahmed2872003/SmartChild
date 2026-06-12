const reportUtil = require('../../utils/report');
const { AssessmentModel, CategoryModel, TestModel, OverallReportModel } = require('../../models/index');
const { overallReportEvents } = require('../events');
const recommendationUtil = require('../../utils/recommendation');

overallReportEvents.on('updateOverallReport', async ({ childId }) => {
  try {
    const categories = await CategoryModel.find({ name: { $in: ['Color Explore', 'Art'] } }).select('_id name');

    const testsInfo = await TestModel.find({ category_id: { $in: categories.map((c) => c._id) } }, null, {
      skipAutoPopulate: true,
    });

    const testsInfoIds = testsInfo.map((test) => test._id);

    const assessments = await AssessmentModel.find({ child_id: childId, status: 'completed' })
      .select('_id')
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: 'tests',
        match: { test_id: { $in: testsInfoIds } },
        select: 'difficulty results rawData',
      })
      .populate({ path: 'report', select: 'results' });

    assessments.reverse();

    const assessTests = assessments.flatMap((assessment) => assessment.tests);

    const categoryAssessTestsMap = assessTests.reduce(
      (acc, t) => ((acc[t.test_id.category_id.name.split(' ')[0].toLowerCase()] ??= []).push(t), acc),
      {},
    );

    const colorRadar = reportUtil.aggregateColorRadar(categoryAssessTestsMap.color);

    let { overallFeeling } = reportUtil.getOverallFeeling(categoryAssessTestsMap.art);

    categoryAssessTestsMap.art.reduce(
      (acc, { results }) => (
        (acc[results.metrics.classification.emotion] = (acc[results.metrics.classification.emotion] || 0) + 1),
        acc
      ),
      {},
    );

    const reports = assessments.map((assessment) => assessment.report);

    const overallGrowth = reportUtil.calcOverallGrowth(reports);

    const overallSystemRecommendation = recommendationUtil.generateGeneralRecommendation(
      reportUtil.calcReportsAvg(reports),
    );

    await OverallReportModel.findOneAndUpdate(
      { child_id: childId },
      {
        overall_system_recommendation: overallSystemRecommendation,
        overall_growth_percentage: overallGrowth,
        overall_feeling: overallFeeling,
        color_radar_profile: colorRadar,
      },
    );

    // Overall Growth Remaining
  } catch (err) {
    console.error('Background task failed for Overall Report update:', err);
  }
});
