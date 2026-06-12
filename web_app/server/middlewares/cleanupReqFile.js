const FileService = require('../services/FileService');

const cleanupReqFile = async (err, req, res, next) => {
  try {
    if (req.file) {
      await FileService.deleteFile(req.file.filename);
    }
  } catch (err) {
    console.error('Failed to clean up orphaned files:', err.message);
  }

  next(err);
};

module.exports = { cleanupReqFile };
