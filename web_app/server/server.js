const connectDB = require('./models/db/connect');

const app = require(`${__dirname}/app`);

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED EXCEPTION!!');
  console.log('Shutting down...');
  process.exit(1);
});

const port = process.env.PORT;

connectDB();

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!!');
  console.log('Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
