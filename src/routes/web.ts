import { Router, Request, Response } from 'express';
import path from 'path';

const router = Router();

// Home Route (Can return a View or String)
router.get('/', (req: Request, res: Response) => {
    const viewPath = path.join(process.cwd(), 'views', 'welcome.html');
    res.sendFile(viewPath); 
});

// Health Check / Status
router.get('/status', (req: Request, res: Response) => {
    res.json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

export default router;