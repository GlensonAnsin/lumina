import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import db from './src/models/index.js';
import RouteService from './src/services/RouteService.js';
import ExceptionHandler from './src/exceptions/Handler.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.APP_PORT || 3000;

// ==========================
// Global Middleware
// ==========================
app.use(helmet());             // Security Headers
app.use(cors());               // Cross-Origin Resource Sharing
app.use(express.json());       // Parse JSON bodies (API)
app.use(express.urlencoded({ extended: true })); // Parse Form bodies
app.use(express.static(path.join(process.cwd(), 'public')));

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
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

start();