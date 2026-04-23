import { NextFunction, Request, Response } from 'express';
import PatientDisease from '../models/PatientDisease';
import Patient from '../models/Patient';

async function assertPatientOwnership(patientId: string, doctorId?: string): Promise<boolean> {
  const patient = await Patient.findOne({ _id: patientId, doctor: doctorId });
  return patient !== null;
}

export async function listForPatient(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const owned = await assertPatientOwnership(req.params.id, req.doctorId);
    if (!owned) {
      res.status(404).json({ error: { message: 'Paciente não encontrado' } });
      return;
    }
    const entries = await PatientDisease.find({ patient: req.params.id })
      .populate('disease')
      .sort({ dateOfDiagnosis: -1 });
    res.json(entries);
  } catch (err) {
    next(err);
  }
}

export async function addToPatient(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const owned = await assertPatientOwnership(req.params.id, req.doctorId);
    if (!owned) {
      res.status(404).json({ error: { message: 'Paciente não encontrado' } });
      return;
    }
    const entry = await PatientDisease.create({
      patient: req.params.id,
      disease: req.body.diseaseId,
      dateOfDiagnosis: req.body.dateOfDiagnosis,
      status: req.body.status
    });
    const populated = await entry.populate('disease');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const entry = await PatientDisease.findById(req.params.id);
    if (!entry) {
      res.status(404).json({ error: { message: 'Diagnóstico não encontrado' } });
      return;
    }
    const owned = await assertPatientOwnership(entry.patient.toString(), req.doctorId);
    if (!owned) {
      res.status(404).json({ error: { message: 'Diagnóstico não encontrado' } });
      return;
    }

    if (req.body.status !== undefined) entry.status = req.body.status;
    if (req.body.dateOfDiagnosis !== undefined) entry.dateOfDiagnosis = req.body.dateOfDiagnosis;
    await entry.save();
    await entry.populate('disease');
    res.json(entry);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const entry = await PatientDisease.findById(req.params.id);
    if (!entry) {
      res.status(404).json({ error: { message: 'Diagnóstico não encontrado' } });
      return;
    }
    const owned = await assertPatientOwnership(entry.patient.toString(), req.doctorId);
    if (!owned) {
      res.status(404).json({ error: { message: 'Diagnóstico não encontrado' } });
      return;
    }
    await entry.deleteOne();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
