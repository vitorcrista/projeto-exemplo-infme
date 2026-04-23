import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

interface JwtPayload {
  sub: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: { message: 'Token em falta' } });
    return;
  }
  const token = header.substring('Bearer '.length).trim();
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.doctorId = decoded.sub;
    next();
  } catch {
    res.status(401).json({ error: { message: 'Token inválido ou expirado' } });
  }
}
