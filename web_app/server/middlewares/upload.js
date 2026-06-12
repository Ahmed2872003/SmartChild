const multer = require('multer');
const path = require('path');
const AppError = require('../utils/appError');
const { StatusCodes } = require('http-status-codes');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../uploads/profiles`);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: process.env.MAX_FILE_SIZE_MB * 1024 * 1024 }, // Limit 2MB
  fileFilter: (req, file, cb) => {
    // Only accept images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Only images are allowed!', StatusCodes.BAD_REQUEST), false);
    }
  },
});

module.exports = upload;
