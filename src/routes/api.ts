import { Router } from 'express';
import UserController from '../controllers/UserController.js';

const router = Router();
// Standard API Routes
router.get('/users', UserController.index);
router.post('/users', UserController.store);

export default router;