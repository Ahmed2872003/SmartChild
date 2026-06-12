const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

const { ChatSessionModel } = require('../models/index');

const createSession = handlerFactory.createOne(ChatSessionModel);

const getSessions = handlerFactory.getMany(ChatSessionModel);

const deleteSession = handlerFactory.deleteOne(ChatSessionModel);

module.exports = { createSession, getSessions, deleteSession };
