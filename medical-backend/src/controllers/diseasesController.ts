import { NextFunction, Request, Response } from 'express';
import Disease from '../models/Disease';

export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const diseases = await Disease.find().sort({ name: 1 });
    res.json(diseases);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) {
      res.status(404).json({ error: { message: 'Doença não encontrada' } });
      return;
    }
    res.json(disease);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const disease = await Disease.create(req.body);
    res.status(201).json(disease);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const disease = await Disease.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!disease) {
      res.status(404).json({ error: { message: 'Doença não encontrada' } });
      return;
    }
    res.json(disease);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const disease = await Disease.findByIdAndDelete(req.params.id);
    if (!disease) {
      res.status(404).json({ error: { message: 'Doença não encontrada' } });
      return;
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
