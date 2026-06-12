const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitizer = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const setupSecurityMiddlewares = (app) => {
  app.use(
    cors({
      origin: ['http://localhost:4173', 'http://localhost:5173', process.env.CLIENT_URL],
      credentials: true,
    }),
  );

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  app.use(mongoSanitizer());

  app.use(xss());

  app.use(
    hpp({
      whitelist: ['duration', 'ratingAverage', 'ratingQuantity', 'maxGroupSize', 'difficulty', 'price'],
    }),
  );
};

const setupParsingMiddlewares = (app) => {
  app.use(express.json({ limit: '10kb' }));
};

const setupLoggingMiddlewares = (app) => {
  app.use(morgan('dev'));

  app.use((req, res, next) => {
    req.requestDate = new Date().toISOString();
    next();
  });

  app.use((req, res, next) => {
    console.log(`This request had been made at ${req.requestDate}`);
    next();
  });
};

const setupRateLimiting = (app) => {
  const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
  });

  app.use('/api', limiter);
};

const setupStaticFiles = (app) => {
  app.use('/public', express.static(`${__dirname}/../public/`));

  app.use('/uploads', express.static(`${__dirname}/../uploads`));
};

const setupMiddlewares = (app) => {
  setupSecurityMiddlewares(app);
  setupParsingMiddlewares(app);
  setupLoggingMiddlewares(app);
  setupRateLimiting(app);
  setupStaticFiles(app);
};

module.exports = setupMiddlewares;
