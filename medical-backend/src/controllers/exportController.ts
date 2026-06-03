import { NextFunction, Request, Response } from 'express';
import Patient, { PatientDocument } from '../models/Patient';
import PatientDisease from '../models/PatientDisease';
import { DiseaseDocument } from '../models/Disease';
import { escapeXml, toXsdDate, toXsdDateTime } from '../utils/xml';

/**
 * Exporta todos os pacientes do médico autenticado, com os respetivos
 * diagnósticos, em XML. O formato é validável pelo schema
 * `schema/medical-export.xsd`.
 */
export async function exportXml(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const patients = await Patient.find({ doctor: req.doctorId }).sort({
      lastName: 1,
      firstName: 1
    });

    const diagnoses = await PatientDisease.find({
      patient: { $in: patients.map((p) => p._id) }
    })
      .populate<{ disease: DiseaseDocument }>('disease')
      .sort({ dateOfDiagnosis: -1 });

    // Agrupa diagnósticos por id de paciente.
    const byPatient = new Map<string, typeof diagnoses>();
    for (const d of diagnoses) {
      const key = d.patient.toString();
      const bucket = byPatient.get(key) ?? [];
      bucket.push(d);
      byPatient.set(key, bucket);
    }

    const xml = buildXml(patients, byPatient);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="pacientes.xml"');
    res.send(xml);
  } catch (err) {
    next(err);
  }
}

function buildXml(
  patients: PatientDocument[],
  byPatient: Map<string, Array<{ disease: DiseaseDocument } & { _id: unknown; status: string; dateOfDiagnosis: Date }>>
): string {
  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push(
    `<medicalExport exportedAt="${toXsdDateTime(new Date())}" patientCount="${patients.length}">`
  );

  for (const p of patients) {
    lines.push(
      `  <patient id="${escapeXml(p._id)}" snsNumber="${escapeXml(p.snsNumber)}" gender="${escapeXml(p.gender)}">`
    );
    lines.push(`    <firstName>${escapeXml(p.firstName)}</firstName>`);
    lines.push(`    <lastName>${escapeXml(p.lastName)}</lastName>`);
    lines.push(`    <dateOfBirth>${toXsdDate(p.dateOfBirth)}</dateOfBirth>`);
    lines.push('    <diseases>');

    const entries = byPatient.get(p._id!.toString()) ?? [];
    for (const e of entries) {
      lines.push(
        `      <diagnosis id="${escapeXml(e._id)}" status="${escapeXml(e.status)}">`
      );
      lines.push(`        <name>${escapeXml(e.disease.name)}</name>`);
      if (e.disease.description) {
        lines.push(`        <description>${escapeXml(e.disease.description)}</description>`);
      }
      lines.push(`        <dateOfDiagnosis>${toXsdDate(e.dateOfDiagnosis)}</dateOfDiagnosis>`);
      lines.push('      </diagnosis>');
    }

    lines.push('    </diseases>');
    lines.push('  </patient>');
  }

  lines.push('</medicalExport>');
  return lines.join('\n');
}
