import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/ApiResponse.js';

class Authentication {
  /**
   * Handle an incoming request.
   */
  handle(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return ApiResponse.error(res, 'Unauthorized: No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
      const secret = process.env.JWT_SECRET || 'default_secret';
      const decoded = jwt.verify(token, secret);

      req.user = decoded;

      next();
    } catch (error) {
      return ApiResponse.error(res, 'Unauthorized: Invalid token', 401);
    }
  }
}

export default new Authentication();