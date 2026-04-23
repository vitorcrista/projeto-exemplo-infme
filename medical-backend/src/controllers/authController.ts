import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';

import Doctor from '../models/Doctor';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '12h') as SignOptions['expiresIn'];

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      res.status(400).json({ error: { message: 'email e password são obrigatórios' } });
      return;
    }

    const doctor = await Doctor.findOne({ email: email.toLowerCase() });
    if (!doctor) {
      res.status(401).json({ error: { message: 'Credenciais inválidas' } });
      return;
    }

    const ok = await bcrypt.compare(password, doctor.passwordHash);
    if (!ok) {
      res.status(401).json({ error: { message: 'Credenciais inválidas' } });
      return;
    }

    const token = jwt.sign({ sub: doctor.id as string }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    res.json({ token, doctor: doctor.toJSON() });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.doctorId) {
      res.status(401).json({ error: { message: 'Não autenticado' } });
      return;
    }
    const doctor = await Doctor.findById(req.doctorId);
    if (!doctor) {
      res.status(401).json({ error: { message: 'Médico não encontrado' } });
      return;
    }
    res.json(doctor.toJSON());
  } catch (err) {
    next(err);
  }
}
