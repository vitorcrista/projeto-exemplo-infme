import { Router } from 'express';
import * as ctrl from '../controllers/patientDiseasesController';

const router = Router();

router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;
