import { Router } from 'express';
import WebController from '../controllers/WebController.js';
import Csrf from '../middlewares/Csrf.js';

class WebRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    // Apply CSRF protection to all web routes
    this.router.use(Csrf.handle);

    // --- Public Routes ---
    this.router.get('/', WebController.index);
    this.router.get('/status', WebController.status);
    this.router.get('/health', WebController.health);

  }
}

export default new WebRoutes().router;
