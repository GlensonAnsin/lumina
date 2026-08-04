import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import db from './models/index.js';
import RouteService from './services/RouteService.js';
import ExceptionHandler from './exceptions/Handler.js';
import Logger from './utils/Logger.js';
import Limiter from './middlewares/Limiter.js';
import Maintenance from './middlewares/Maintenance.js';
import RequestLogger from './middlewares/RequestLogger.js';
import env from './config/env.js';
import InertiaMiddleware from './middlewares/InertiaMiddleware.js';
import WebAuth from './middlewares/WebAuth.js';

const app: Application = express();
const PORT = env.APP_PORT;

// ==========================
// Global Middleware
// ==========================
app.use(Maintenance.handle);
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
}));
// CORS_ORIGIN is comma-separated. In development, any localhost/127.0.0.1
// origin is additionally allowed regardless of port, so dev tooling that
// picks a random port (e.g. `flutter run -d chrome`) works out of the box.
const corsOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
const localhostOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || corsOrigins.includes(origin)) return callback(null, true);
    if (env.NODE_ENV !== 'production' && localhostOrigin.test(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// User detection and Inertia
app.use(WebAuth.detect.bind(WebAuth));
app.use(InertiaMiddleware.handle);

app.use(express.static(path.join(process.cwd(), 'public')));
app.use(Limiter.global);
app.use(RequestLogger.handle);

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
let server: ReturnType<typeof app.listen>;

const start = async () => {
  try {
    // Test Database Connection
    await db.connect();

    // Start Listening
    server = app.listen(PORT, () => {
      Logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    Logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// ==========================
// Graceful Shutdown
// ==========================
const shutdown = async (signal: string) => {
  Logger.info(`${signal} received. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      Logger.info('HTTP server closed.');

      try {
        await db.sequelize.close();
        Logger.info('Database connection closed.');
      } catch (error) {
        Logger.error('Error closing database connection:', error);
      }

      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      Logger.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();