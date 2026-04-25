import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import AuthService from '../services/AuthService.js';
import Logger from '../utils/Logger.js';
import { UserPayload } from '../types/express/index.js';


class WebAuth {
  /**
   * Middleware to protect web routes and redirect to login if not authenticated.
   */
  public async handle(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;

    if (!accessToken) {
      // If no access token, try to refresh
      if (refreshToken) {
        return this.silentRefresh(req, res, next, refreshToken);
      }
      return res.redirect('/login');
    }

    try {
      // Verify access token
      const decoded = jwt.verify(accessToken, env.JWT_SECRET) as UserPayload;
      req.user = decoded;
      next();
    } catch (error) {
      // Access token invalid/expired, try refresh
      if (refreshToken) {
        return this.silentRefresh(req, res, next, refreshToken);
      }
      res.clearCookie('access_token');
      return res.redirect('/login');
    }
  }

  /**
   * Middleware to detect the user but allow the request to continue.
   * Useful for public pages that need to know if a user is logged in.
   */
  public async detect(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;

    if (!accessToken) {
      if (refreshToken) {
        try {
          const { accessToken: newToken } = await AuthService.refresh(refreshToken);
          res.cookie('access_token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
          });
          const decoded = jwt.verify(newToken, env.JWT_SECRET) as UserPayload;
          req.user = decoded;
        } catch (error) {
          // Silent failure
          Logger.debug('Silent refresh failed in detect middleware');
        }
      }
      return next();
    }

    try {
      const decoded = jwt.verify(accessToken, env.JWT_SECRET) as UserPayload;
      req.user = decoded;
      next();
    } catch (error) {
      // Access token invalid/expired, try silent refresh
      if (refreshToken) {
        try {
          const { accessToken: newToken } = await AuthService.refresh(refreshToken);
          res.cookie('access_token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
          });
          const decoded = jwt.verify(newToken, env.JWT_SECRET) as UserPayload;
          req.user = decoded;
        } catch (err) {
          Logger.debug('Silent refresh failed in detect middleware after verify error');
        }
      }
      next();
    }
  }

  /**
   * Attempt to refresh the access token silently.
   */
  private async silentRefresh(req: Request, res: Response, next: NextFunction, token: string) {
    try {
      const { accessToken } = await AuthService.refresh(token);

      // Set new access token cookie
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });

      // Verify the new token to get user data
      const decoded = jwt.verify(accessToken, env.JWT_SECRET) as UserPayload;
      req.user = decoded;

      next();
    } catch (error) {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      return res.redirect('/login');
    }
  }
}


export default new WebAuth();
