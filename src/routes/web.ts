import { Router, Request, Response } from 'express';
import path from 'path';

class WebRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    // Home Route
    this.router.get('/', (req: Request, res: Response) => {
      const viewPath = path.join(process.cwd(), 'views', 'welcome.html');
      res.sendFile(viewPath);
    });

    // Status Route
    this.router.get('/status', (req: Request, res: Response) => {
      res.json({ status: 'UP', environment: process.env.NODE_ENV });
    });
  }
}

export default new WebRoutes().router;