const catchAsync = require('../utils/catchAsync');
const { StoryModel } = require('../models/index');

const factoryHandler = require('./handlerFactory');

const getStories = factoryHandler.getMany(StoryModel);

module.exports = {
  getStories,
};
