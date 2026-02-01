import { Request, Response, NextFunction } from 'express';
import ApiResponse from '../utils/ApiResponse.js';
import dotenv from 'dotenv';

dotenv.config();

class ExceptionHandler {
  /**
   * Handle 404 Not Found errors.
   */
  notFound(req: Request, res: Response, next: NextFunction) {
    return ApiResponse.error(res, 'Route not found', 404);
  }

  /**
   * Handle global application errors.
   * Matches Express (err, req, res, next) signature.
   */
  handle(err: any, req: Request, res: Response, next: NextFunction) {
    // Log the error
    console.error('Exception:', err.stack || err.message);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    const errorDetails = process.env.NODE_ENV === 'development' ? err : {};

    return ApiResponse.error(res, message, status, errorDetails);
  }
}

export default new ExceptionHandler();