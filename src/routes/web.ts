import { Router, Request, Response } from 'express';

const router = Router();

// Home Route (Can return a View or String)
router.get('/', (req: Request, res: Response) => {
    res.send('<h1>Welcome to Lumina Express</h1>'); 
});

// Health Check / Status
router.get('/status', (req: Request, res: Response) => {
    res.send('Application is up and running.');
});

export default router;