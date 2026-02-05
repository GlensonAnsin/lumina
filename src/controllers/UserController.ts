import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService.js';
import ApiResponse from '../utils/ApiResponse.js';

class UserController {
  /**
   * Get paginated list of users.
   */
  public async index(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 15;
      const users = await UserService.getAllUsers(page, limit);
      return ApiResponse.success(res, users, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public async store(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.body);
      return ApiResponse.success(res, user, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  public async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return ApiResponse.error(res, 'No file uploaded', 400);
      }

      // 1. Get the file path relative to your server
      const filePath = `uploads/${req.file.filename}`;

      // 2. Update the user in the DB (assuming you have req.user from AuthMiddleware)
      await UserService.updateAvatar(req.user.id, filePath);

      // 3. Return success
      return ApiResponse.success(res, {
        path: filePath,
        url: `${req.protocol}://${req.get('host')}/${filePath}`
      }, 'Avatar uploaded successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();