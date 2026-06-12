# Server / Backend Execution Guide

This directory contains the backend service and API for the platform.

## 🛠 Available Scripts

**Ensure a valid `.env` file is present in this directory before running any commands.**

In the server directory, you can run the following commands:

### Production Server

Starts the production-ready backend server. This is the standard command used to run the engine for final evaluation and testing:

```bash
npm start
```

### Development Server

Starts the backend server in development mode. It will actively watch for any changes in your source files and automatically restart the server during active development:

```bash
npm run start:watch
```

### Seed Test Data

Automatically populates the connected database with mock test data (such as sample users or cognitive assessment records) to instantly prepare the environment for testing without manual data entry:

```bash
npm run seedTestData
```

### Seed Story Data

Injects the foundational, structured story content and activity modules directly into the database so they are immediately available to the client application:

```bash
npm run seedStoryData
```
