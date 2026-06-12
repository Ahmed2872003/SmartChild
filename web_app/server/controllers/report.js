const catchAsync = require('../utils/catchAsync');
const { AssessmentModel, CategoryModel, TestModel, OverallReportModel } = require('../models/index');
const AppError = require('../utils/appError');
const { StatusCodes } = require('http-status-codes/build/cjs');

const getDailyReports = catchAsync(async (req, res, next) => {
  const { childId } = req.params;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;

  const skip = (page - 1) * limit;

  const assessments = await AssessmentModel.find({ child_id: childId, status: 'completed' })
    .select('_id')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({ path: 'report' });

  const totalItems = await AssessmentModel.countDocuments({ child_id: childId, status: 'completed' });

  const hasNextPage = skip + assessments.length < totalItems;

  res.json({
    data: assessments,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      hasNextPage,
    },
  });
});

const getOverallReport = catchAsync(async (req, res, next) => {
  const { childId } = req.params;

  const overallReportPromise = OverallReportModel.findOne({ child_id: childId }).select('-child_id');

  const dailyReportsPromise = AssessmentModel.find({ child_id: childId, status: 'completed' })
    .select('_id')
    .sort({ createdAt: -1 })
    .limit(5)
    .populate({ path: 'report' });

  let [overallReport, dailyReports] = await Promise.all([overallReportPromise, dailyReportsPromise]);

  if (!overallReport) throw new AppError(`No report found for child_id: ${childId}`, StatusCodes.NOT_FOUND);

  dailyReports.reverse();

  dailyReports = dailyReports.map((dailyReport) => {
    const reportObj = dailyReport.report.toObject();

    const { art, ...resultsWithoutArt } = reportObj.results;

    return resultsWithoutArt;
  });

  res.json({ data: { overallReport: { ...overallReport.toJSON(), dailyReports } } });
});

module.exports = { getDailyReports, getOverallReport };
