import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import db from './src/models/index.js';
import RouteService from './src/services/RouteService.js';
import ExceptionHandler from './src/exceptions/Handler.js';
import Logger from './src/utils/Logger.js'
import Limiter from './src/middlewares/Limiter.js'

const app: Application = express();
const PORT = process.env.APP_PORT || 3000;

// ==========================
// Global Middleware
// ==========================
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(Limiter.global);

// ==========================
// Register Routes
// ==========================
// This loads both your API and Web routes
RouteService.boot(app);

// ==========================
// Error Handling
// ==========================

// 404 Not Found Handler
app.use(ExceptionHandler.notFound);

// Global Error Handler
app.use(ExceptionHandler.handle);

// ==========================
// Start Server
// ==========================
const start = async () => {
  try {
    // Test Database Connection
    await db.connect();

    // Start Listening
    app.listen(PORT, () => {
      Logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    Logger.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

start();