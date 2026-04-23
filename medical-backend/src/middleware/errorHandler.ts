import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

interface MongoDuplicateKeyError extends Error {
  code?: number;
}

export function errorHandler(
  err: Error & { code?: number; value?: unknown; errors?: unknown },
  _req: Request,
  res: Response,
  _next: NextFunction
): Response | void {
  if (err instanceof MongooseError.ValidationError || err.name === 'ValidationError') {
    return res.status(400).json({
      error: { message: err.message, code: 'VALIDATION_ERROR', details: err.errors }
    });
  }
  if (err instanceof MongooseError.CastError || err.name === 'CastError') {
    return res.status(400).json({
      error: { message: `ID inválido: ${err.value}`, code: 'INVALID_ID' }
    });
  }
  if ((err as MongoDuplicateKeyError).code === 11000) {
    return res.status(409).json({
      error: { message: 'Registo duplicado (snsNumber já existe)', code: 'DUPLICATE_KEY' }
    });
  }
  console.error(err);
  res.status(500).json({ error: { message: err.message || 'Erro interno' } });
}
