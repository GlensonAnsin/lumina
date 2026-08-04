import { Router } from 'express';
import WebController from '../controllers/WebController.js';
import Csrf from '../middlewares/Csrf.js';
import WebAuth from '../middlewares/WebAuth.js';

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

    // --- Auth Routes ---
    // WebAuth redirects unauthenticated visitors to /login, so these must be
    // registered for the web session flow to work at all.
    this.router.get('/login', WebController.showLogin);
    this.router.post('/login', WebController.login);
    this.router.post('/logout', WebController.logout);

    // --- Protected Routes ---
    // Everything registered below this line requires an authenticated session.
    this.router.use(WebAuth.handle);
  }
}

export default new WebRoutes().router;
