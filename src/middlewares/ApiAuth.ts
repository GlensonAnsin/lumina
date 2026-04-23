import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/ApiResponse.js';
import env from '../config/env.js';
import AuthService from '../services/AuthService.js';

class ApiAuth {
  /**
   * Handle an incoming request.
   */
  public async handle(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith('Bearer') ? authHeader.split(' ')[1] : null;
    const refreshToken = req.headers['x-refresh-token'] as string || req.cookies?.refresh_token;

    if (!accessToken) {
      return ApiResponse.error(res, 'Unauthorized: No token provided', 401);
    }

    try {
      // Verify access token
      const decoded = jwt.verify(accessToken, env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error: any) {
      // If token is expired and we have a refresh token, try to silent refresh
      if (error.name === 'TokenExpiredError' && refreshToken) {
        return this.silentRefresh(req, res, next, refreshToken);
      }
      
      return ApiResponse.error(res, 'Unauthorized: Invalid or expired token', 401);
    }
  }

  /**
   * Attempt to refresh the API token silently.
   */
  private async silentRefresh(req: Request, res: Response, next: NextFunction, token: string) {
    try {
      const { accessToken } = await AuthService.refresh(token);

      // Verify the new token
      const decoded = jwt.verify(accessToken, env.JWT_SECRET);
      req.user = decoded;

      // Add the new token to the response header so the client can update it
      res.setHeader('X-New-Access-Token', accessToken);
      
      // If the client sent the refresh token via cookie, update the access token cookie too
      if (req.cookies?.refresh_token) {
        res.cookie('access_token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
        });
      }

      next();
    } catch (error) {
      return ApiResponse.error(res, 'Unauthorized: Refresh token expired or invalid', 401);
    }
  }
}

export default new ApiAuth();