import { Request, Response } from 'express';
import AuthService from '../services/AuthService.js';
import ApiResponse from '../utils/ApiResponse.js';

class AuthController {
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return ApiResponse.success(res, result, 'Login successful');
    } catch (error: any) {
      return ApiResponse.error(res, error.message, 401);
    }
  }

  public async me(req: Request, res: Response) {
    return ApiResponse.success(res, req.user);
  }
}

export default new AuthController();