import { Router } from 'express';
import * as ctrl from '../controllers/authController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.post('/login', ctrl.login);
router.get('/me', requireAuth, ctrl.me);

export default router;
