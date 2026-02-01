import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import Authentication from '../middlewares/Authentication.js';

class ApiRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  /**
   * Define all API routes here.
   */
  protected initializeRoutes(): void {
    this.router.get('/users', Authentication.handle, UserController.index);
    this.router.post('/users', UserController.store);
  }
}

export default new ApiRoutes().router;