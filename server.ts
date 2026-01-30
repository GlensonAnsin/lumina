import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './src/models/index';
import routes from './src/routes/index';

// Load Environment Variables
dotenv.config();

// Setup __dirname for ESM (Since it doesn't exist by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve Static Files
app.use(express.static(path.join(__dirname, '../public')));

// ==========================
// Register Routes
// ==========================
// This loads both your API and Web routes from src/routes/index.ts
app.use(routes);

// ==========================
// Error Handling
// ==========================

// 404 Not Found Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// ==========================
// Start Server
// ==========================
const start = async () => {
  try {
    // Test Database Connection
    await db.sequelize.authenticate();
    console.log('✅ Database connected successfully.');

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