const path = require('path');
const FileService = require('../services/FileService');
const catchAsync = require('../utils/catchAsync');

const cleanupOldFile = (objectName, propertyName) => {
  objectName = objectName.charAt(0).toUpperCase() + objectName.slice(1);
  objectName = `old${objectName}`;

  return async (req, res, next) => {
    if (!req[objectName]) return next();

    const oldFilePath = path.resolve(__dirname, '../uploads/profiles', req[objectName][propertyName]);

    if (req.method === 'PATCH' && !req.body[propertyName]) return next();

    FileService.deleteFile(req[objectName][propertyName]).catch((err) => {});

    next();
  };
};

module.exports = { cleanupOldFile };
