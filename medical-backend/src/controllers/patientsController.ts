import { NextFunction, Request, Response } from 'express';
import Patient from '../models/Patient';
import PatientDisease from '../models/PatientDisease';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const patients = await Patient.find({ doctor: req.doctorId }).sort({
      lastName: 1,
      firstName: 1
    });
    res.json(patients);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, doctor: req.doctorId });
    if (!patient) {
      res.status(404).json({ error: { message: 'Paciente não encontrado' } });
      return;
    }
    res.json(patient);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const patient = await Patient.create({ ...req.body, doctor: req.doctorId });
    res.status(201).json(patient);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { doctor: _ignored, ...body } = req.body ?? {};
    void _ignored;
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, doctor: req.doctorId },
      body,
      { new: true, runValidators: true }
    );
    if (!patient) {
      res.status(404).json({ error: { message: 'Paciente não encontrado' } });
      return;
    }
    res.json(patient);
  } catch (err) {
    next(err);
  }
}

/**
 * Apaga todos os pacientes do médico autenticado e os respetivos diagnósticos.
 * Não toca no catálogo de doenças (partilhado entre médicos).
 */
export async function removeAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const patients = await Patient.find({ doctor: req.doctorId }).select('_id');
    const ids = patients.map((p) => p._id);
    const diagnoses = await PatientDisease.deleteMany({ patient: { $in: ids } });
    const removed = await Patient.deleteMany({ doctor: req.doctorId });
    res.json({
      ok: true,
      deleted: {
        patients: removed.deletedCount ?? 0,
        diagnoses: diagnoses.deletedCount ?? 0
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const patient = await Patient.findOneAndDelete({
      _id: req.params.id,
      doctor: req.doctorId
    });
    if (!patient) {
      res.status(404).json({ error: { message: 'Paciente não encontrado' } });
      return;
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
