import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import ApiResponse from '../utils/ApiResponse.js';

class Maintenance {
  private lockFile = path.join(process.cwd(), 'maintenance.lock');

  public handle = (req: Request, res: Response, next: NextFunction) => {
    if (fs.existsSync(this.lockFile)) {
      const bypassSecret = req.headers['x-bypass-maintenance'];

      if (bypassSecret === process.env.MAINTENANCE_SECRET) {
        return next();
      }

      res.setHeader('Retry-After', '60');
      return ApiResponse.error(res, 'System is currently under maintenance. Please try again later.', 503);
    }
    
    next();
  };
}

export default new Maintenance();