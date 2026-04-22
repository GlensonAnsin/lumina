import { Router, Request, Response } from 'express';
import db from '../models/index.js';

class WebRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    // Home Route
    this.router.get('/', (req: Request, res: Response) => {
      res.inertia('Welcome', { version: '1.0.0' });
    });

    // Status Route
    this.router.get('/status', (req: Request, res: Response) => {
      res.inertia('Status', {
        status: 'UP',
        environment: process.env.NODE_ENV,
        uptime: process.uptime(),
        memoryMB: (process.memoryUsage().rss / 1024 / 1024).toFixed(1),
      });
    });

    // Status JSON API (used by the status view)
    this.router.get('/status/json', (req: Request, res: Response) => {
      res.json({
        status: 'UP',
        environment: process.env.NODE_ENV,
        uptime: process.uptime(),
        memoryMB: (process.memoryUsage().rss / 1024 / 1024).toFixed(1),
      });
    });

    // Health Check (for container/orchestration probes)
    this.router.get('/health', async (req: Request, res: Response) => {
      try {
        await db.sequelize.authenticate();
        res.json({
          status: 'healthy',
          uptime: process.uptime(),
          database: 'connected',
          timestamp: new Date().toISOString(),
        });
      } catch {
        res.status(503).json({
          status: 'unhealthy',
          uptime: process.uptime(),
          database: 'disconnected',
          timestamp: new Date().toISOString(),
        });
      }
    });
  }
}

export default new WebRoutes().router;