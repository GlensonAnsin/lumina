import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService.js';
import ApiResponse from '../utils/ApiResponse.js';

class UserController {
  /**
   * Get paginated list of users.
   */
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 15;
      const users = await UserService.getAllUsers(page, limit);
      return ApiResponse.success(res, users, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.body);
      return ApiResponse.success(res, user, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();