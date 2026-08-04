import { Request, Response } from 'express';
import db from '../models/index.js';
import AuthService from '../services/AuthService.js';



class WebController {
  /**
   * Render the Welcome page.
   */
  public async index(req: Request, res: Response) {
    return res.inertia('Welcome', { 
      version: '1.0.0' 
    });
  }

  /**
   * Render the System Status page.
   */
  public async status(req: Request, res: Response) {
    return res.inertia('Status', {
      status: 'UP',
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
    });
  }

  /**
   * Health Check (for container/orchestration probes)
   */

  public async health(req: Request, res: Response) {
    try {
      await db.sequelize.authenticate();
      res.json({
        status: 'healthy',
        uptime: process.uptime(),
        database: 'connected',
        timestamp: new Date().toISOString(),
      });
    } catch {
      res.status(503).json({
        status: 'unhealthy',
        uptime: process.uptime(),
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Show Login Page
   */
  public async showLogin(req: Request, res: Response) {
    return res.inertia('Auth/Login');
  }

  /**
   * Handle Login Action
   */
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken } = await AuthService.login(email, password);

      // Set Access Token (Short-lived)
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 mins
      });

      // Set Refresh Token (Long-lived)
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // '/users' is an API-only route — send authenticated users to the app root.
      return res.redirect('/');
    } catch (error: any) {
      return res.inertia('Auth/Login', {
        errors: { email: 'Invalid credentials' }
      });
    }
  }

  /**
   * Handle Logout — revokes the refresh token server-side (so it can't be
   * replayed) and clears both session cookies. Doesn't require a valid
   * access token: an expired/corrupt session should still be able to log out.
   */
  public async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.redirect('/login');
  }
}




export default new WebController();
