import { Router } from 'express';
import WebController from '../controllers/WebController.js';

class WebRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    // Home Route
    this.router.get('/', WebController.index);

    // Status Route
    this.router.get('/status', WebController.status);

    // Health Check (for container/orchestration probes)
    this.router.get('/health', WebController.health);

  }
}

export default new WebRoutes().router;
