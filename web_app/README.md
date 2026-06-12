# SmartChild Platform - Application Setup and Execution Guide

This project is structured as a full-stack monorepo containing both a frontend Vite/React `client` and a Node.js `server`. Follow the instructions below to set up and run the application locally.

## 🌐 Live Demo

Check out the live application here: **[smart-child-self.vercel.app](https://smart-child-self.vercel.app)**

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **[Node.js](https://nodejs.org/)**: The JavaScript runtime environment.

---

## 🛠 Installation

To install all necessary dependencies for the root, frontend, and backend environments simultaneously, open your terminal in the root directory and run:

```bash
npm run install:all
```

---

## 🚀 Running the Application

This project uses `concurrently` to launch both the client and server side-by-side from a single terminal window.

**Ensure a valid `.env` file is present in this directory before running any commands.**

### Standard Execution (Evaluation/Production)

To build the optimized frontend and start the backend server for a seamless local run, execute:

```bash
npm start
```

### Development Mode (Live Reloading)

If you need to modify the source code and require active watching (Hot Module Replacement for the frontend and automatic restarts for the backend), execute:

```bash
npm run start:watch
```
