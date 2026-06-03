import { Router } from 'express';
import express from 'express';
import * as ctrl from '../controllers/patientsController';
import * as pdCtrl from '../controllers/patientDiseasesController';
import * as exportCtrl from '../controllers/exportController';
import * as importCtrl from '../controllers/importController';

const router = Router();

router.get('/', ctrl.list);
// Rotas literais antes de '/:id' para não serem interpretadas como id de paciente.
router.get('/export.xml', exportCtrl.exportXml);
router.post(
  '/import',
  express.text({ type: ['application/xml', 'text/xml', 'application/octet-stream'], limit: '10mb' }),
  importCtrl.importXml
);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/', ctrl.removeAll);
router.delete('/:id', ctrl.remove);

router.get('/:id/diseases', pdCtrl.listForPatient);
router.post('/:id/diseases', pdCtrl.addToPatient);

export default router;
