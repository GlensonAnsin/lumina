import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import Authentication from '../middlewares/Authentication.js';
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
    // Auth
    this.router.post('/login', Limiter.auth, AuthController.login);
    this.router.post('/refresh', AuthController.refresh);
    this.router.post('/logout', Authentication.handle, AuthController.logout);

    // Protected
    this.router.get('/me', Authentication.handle, AuthController.me);
    this.router.get('/users', Authentication.handle, UserController.index);
    this.router.post('/users', Validator.validate(UserRequest.store), UserController.store);
    this.router.post('/users/avatar', Authentication.handle, StorageService.uploader.single('avatar'), UserController.uploadAvatar);
  }
}

export default new ApiRoutes().router;