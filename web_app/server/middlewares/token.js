const tokenModel = require('../models/token');
const ParentChild = require('../models/parentChild');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const { StatusCodes } = require('http-status-codes');

const token = require('../utils/token');

const resolveCoparentToken = (extractRawToken) =>
  catchAsync(async (req, res, next) => {
    const rawToken = extractRawToken(req);

    const tokenDoc = await tokenModel.findOne({
      hashedToken: token.hashToken(rawToken),
      tokenType: 'coparent_request',
    });

    if (!tokenDoc) throw new AppError('Invalid or expired token.', StatusCodes.BAD_REQUEST);

    const pendingLink = await ParentChild.findById(tokenDoc.referenceId);

    if (!pendingLink) throw new AppError('Request no longer exists.', StatusCodes.NOT_FOUND);

    req.pendingLink = pendingLink;

    req.tokenDoc = tokenDoc;

    next();
  });

module.exports = { resolveCoparentToken };
