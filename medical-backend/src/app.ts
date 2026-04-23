import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import patientsRouter from './routes/patients';
import diseasesRouter from './routes/diseases';
import patientDiseasesRouter from './routes/patientDiseases';
import authRouter from './routes/auth';
import { errorHandler } from './middleware/errorHandler';
import { requireAuth } from './middleware/requireAuth';

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' }));
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/api/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));
  app.use('/api/auth', authRouter);

  app.use('/api/patients', requireAuth, patientsRouter);
  app.use('/api/diseases', requireAuth, diseasesRouter);
  app.use('/api/patient-diseases', requireAuth, patientDiseasesRouter);

  app.use((_req: Request, res: Response) =>
    res.status(404).json({ error: { message: 'Rota não encontrada' } })
  );
  app.use(errorHandler);

  return app;
}
