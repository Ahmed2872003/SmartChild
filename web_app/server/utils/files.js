const fs = require('fs');
const util = require('util');

const unlinkAsync = util.promisify(fs.unlink);

const deleteFile = async (filePath) => {
  await unlinkAsync(filePath);
};

module.exports = { deleteFile };
