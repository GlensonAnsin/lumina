import { Request, Response, NextFunction } from 'express';
import ApiResponse from '../utils/ApiResponse.js';

class RoleGuard {
  /**
   * Restrict a route to users whose JWT role is in the allowed list.
   * Must run after ApiAuth.handle, which populates req.user.
   */
  public allow(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return ApiResponse.error(res, 'Forbidden: insufficient permissions', 403);
      }

      next();
    };
  }
}

export default new RoleGuard();
