import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import ApiAuth from '../middlewares/ApiAuth.js';
import RoleGuard from '../middlewares/RoleGuard.js';
import Validator from '../middlewares/Validator.js';
import UserRequest from '../requests/UserRequest.js';
import AuthController from '../controllers/AuthController.js';
import Limiter from '../middlewares/Limiter.js';
import StorageService from '../services/StorageService.js';

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
    // --- Public Routes ---
    this.router.post('/login', Limiter.auth, AuthController.login);
    this.router.post('/refresh', AuthController.refresh);

    // --- Protected Routes Group ---
    const protectedRouter = Router();
    protectedRouter.use(ApiAuth.handle);

    protectedRouter.post('/logout', AuthController.logout);
    protectedRouter.get('/me', AuthController.me);
    protectedRouter.get('/users', RoleGuard.allow('admin'), UserController.index);
    protectedRouter.post('/users', RoleGuard.allow('admin'), Validator.validate(UserRequest.store), UserController.store);
    protectedRouter.post('/users/avatar', StorageService.uploader.single('avatar'), UserController.uploadAvatar);

    // Mount the group
    this.router.use(protectedRouter);
  }
}


export default new ApiRoutes().router;