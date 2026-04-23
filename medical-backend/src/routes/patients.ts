import { Router } from 'express';
import * as ctrl from '../controllers/patientsController';
import * as pdCtrl from '../controllers/patientDiseasesController';

const router = Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

router.get('/:id/diseases', pdCtrl.listForPatient);
router.post('/:id/diseases', pdCtrl.addToPatient);

export default router;
