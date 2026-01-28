import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService.js';
import { successResponse, errorResponse } from '../utils/response.js';

class UserController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      return successResponse(res, users, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.body);
      return successResponse(res, user, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();