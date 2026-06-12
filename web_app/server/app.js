const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error');

const authRouter = require(`${__dirname}/routes/auth`);
const userRouter = require(`${__dirname}/routes/user`);
const childRouter = require(`${__dirname}/routes/child`);
const coparentRouter = require(`${__dirname}/routes/coparent`);
const testRouter = require(`${__dirname}/routes/test`);
const assessmentRouter = require(`${__dirname}/routes/assessment`);
const reportRouter = require(`${__dirname}/routes/report`);
const storyRouter = require(`${__dirname}/routes/story`);
const chatMsgRouter = require(`${__dirname}/routes/chatMsg`);
const chatSessionRouter = require(`${__dirname}/routes/chatsession`);

const setupMiddlewares = require(`${__dirname}/utils/middlewares`);

const express = require('express');
const { cleanupReqFile } = require('./middlewares/cleanupReqFile');

require('./models/index');
require('./events/subscribers/index');

const APIVersion = '1';
const app = express();

// MIDDLEWARE
setupMiddlewares(app);

// ROUTES
app.use(`/api/v${APIVersion}/auth`, authRouter);

app.use(`/api/v${APIVersion}/user`, userRouter);

app.use(`/api/v${APIVersion}/child`, childRouter);

app.use(`/api/v${APIVersion}/coparent`, coparentRouter);

app.use(`/api/v${APIVersion}/test`, testRouter);

app.use(`/api/v${APIVersion}/assessment`, assessmentRouter);

app.use(`/api/v${APIVersion}/report`, reportRouter);

app.use(`/api/v${APIVersion}/story`, storyRouter);

app.use(`/api/v${APIVersion}/chat`, chatMsgRouter);

app.use(`/api/v${APIVersion}/session`, chatSessionRouter);

// Error handler for invalid routes
app.all('*', (req, res, next) => {
  const err = new AppError(`can't find ${req.originalUrl} on this server!`, 404);

  next(err);
});

app.use(cleanupReqFile, globalErrorHandler);

module.exports = app;
