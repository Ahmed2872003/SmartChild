const factory = require('../controllers/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const ParentChild = require('../models/parentChild');
const AppError = require('../utils/appError');
const { StatusCodes } = require('http-status-codes');
const ChildModel = require('../models/child');

const checkParentChildLink = (extractChildId) =>
  catchAsync(async (req, res, next) => {
    const childId = extractChildId(req);

    const parentId = req.user.id;

    const relationship = await ParentChild.findOne({
      parent_id: parentId,
      child_id: childId,
    });

    if (!relationship || relationship.status !== 'accepted')
      throw new AppError('Forbidden: You do not have permission to access this child profile.', StatusCodes.FORBIDDEN);

    req.parentChildLink = relationship.toObject();

    next();
  });

const checkParentChildOwnership = (extractRelationship) =>
  catchAsync(async (req, res, next) => {
    const parentChildLink = extractRelationship(req);

    if (!parentChildLink?.is_owner)
      throw new AppError(
        'Forbidden: You do not have permission to do that action. only owner parent can do.',
        StatusCodes.FORBIDDEN,
      );

    next();
  });

const populateChildPrimaryParent = factory.getOneWithDeepPopulate(
  ChildModel,
  {
    generateFilter: (req) => ({
      share_code: req.body.shareCode,
    }),
  },
  { firstPath: 'parents', firstMatch: { is_owner: true }, secondPath: 'parent_id', secondSelect: 'name email' },
  false,
);

module.exports = { checkParentChildLink, checkParentChildOwnership, populateChildPrimaryParent };
