const fsPromises = require('fs/promises');
const fs = require('fs');

const path = require('path');
const AppError = require('../utils/appError');
const { StatusCodes } = require('http-status-codes/build/cjs');

const PROFILES_DIR = path.resolve(__dirname, '../uploads/profiles');
const DEFAULT_PHOTO = 'default-user.jpg';

class FileService {
  static getPath(filename) {
    return path.join(PROFILES_DIR, filename);
  }

  static getFileStream(filename) {
    const filePath = FileService.getPath(filename);

    if (!fs.existsSync(filePath))
      throw new AppError(`File not found at path: ${filePath}`, StatusCodes.INTERNAL_SERVER_ERROR);

    return fs.createReadStream(filePath);
  }

  static async deleteFile(filename) {
    if (!filename || filename === DEFAULT_PHOTO) return;

    const filePath = FileService.getPath(filename);

    if (!fs.existsSync(filePath))
      throw new AppError(`File not found at path: ${filePath}`, StatusCodes.INTERNAL_SERVER_ERROR);

    await fsPromises.unlink(FileService.getPath(filename));
  }
}

module.exports = FileService;
