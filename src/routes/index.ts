import { Router } from 'express';
import apiRoutes from './api.js';
import webRoutes from './web.js';

const router = Router();
router.use('/api', apiRoutes);
router.use('/', webRoutes);

export default router;