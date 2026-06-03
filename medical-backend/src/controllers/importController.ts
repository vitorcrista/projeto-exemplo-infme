import { NextFunction, Request, Response } from 'express';
import { Element } from 'libxmljs2';
import Patient from '../models/Patient';
import Disease from '../models/Disease';
import PatientDisease from '../models/PatientDisease';
import { validateXml } from '../utils/xsdValidator';

interface ImportSummary {
  patientsCreated: number;
  patientsUpdated: number;
  diseasesCreated: number;
  diagnosesCreated: number;
  diagnosesUpdated: number;
}

/** Texto de um elemento-filho, ou undefined se não existir. */
function childText(node: Element, name: string): string | undefined {
  const child = node.get(name) as Element | null;
  const text = child?.text().trim();
  return text ? text : undefined;
}

function attr(node: Element, name: string): string | undefined {
  return node.attr(name)?.value() ?? undefined;
}

/**
 * Importa pacientes e diagnósticos a partir de um XML.
 * O corpo do pedido é o XML em bruto (Content-Type application/xml).
 * O XML é validado contra o XSD antes de qualquer escrita: se for inválido,
 * devolve 422 com a lista de erros e não grava nada.
 */
export async function importXml(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const xml = typeof req.body === 'string' ? req.body : '';
    if (!xml.trim()) {
      res.status(400).json({ error: { message: 'Corpo XML em falta ou vazio' } });
      return;
    }

    const { doc, errors } = validateXml(xml);
    if (errors.length > 0 || !doc) {
      res.status(422).json({
        error: { message: 'XML inválido', validationErrors: errors }
      });
      return;
    }

    const summary: ImportSummary = {
      patientsCreated: 0,
      patientsUpdated: 0,
      diseasesCreated: 0,
      diagnosesCreated: 0,
      diagnosesUpdated: 0
    };

    const patientNodes = doc.find('//patient') as Element[];
    for (const pNode of patientNodes) {
      const snsNumber = attr(pNode, 'snsNumber')!;
      const gender = attr(pNode, 'gender')!;
      const firstName = childText(pNode, 'firstName')!;
      const lastName = childText(pNode, 'lastName')!;
      const dateOfBirth = new Date(childText(pNode, 'dateOfBirth')!);

      const patientRes = await Patient.findOneAndUpdate(
        { snsNumber },
        { firstName, lastName, dateOfBirth, gender, doctor: req.doctorId },
        { upsert: true, new: true, runValidators: true, includeResultMetadata: true }
      );
      const patient = patientRes.value!;
      if (patientRes.lastErrorObject?.updatedExisting) summary.patientsUpdated++;
      else summary.patientsCreated++;

      const diagnosisNodes = pNode.find('diseases/diagnosis') as Element[];
      for (const dNode of diagnosisNodes) {
        const diseaseName = childText(dNode, 'name')!;
        const description = childText(dNode, 'description');
        const status = attr(dNode, 'status')!;
        const dateOfDiagnosis = new Date(childText(dNode, 'dateOfDiagnosis')!);

        const diseaseRes = await Disease.findOneAndUpdate(
          { name: diseaseName },
          description !== undefined ? { name: diseaseName, description } : { name: diseaseName },
          { upsert: true, new: true, runValidators: true, includeResultMetadata: true }
        );
        const disease = diseaseRes.value!;
        if (!diseaseRes.lastErrorObject?.updatedExisting) summary.diseasesCreated++;

        const diagRes = await PatientDisease.findOneAndUpdate(
          { patient: patient._id, disease: disease._id },
          { dateOfDiagnosis, status },
          { upsert: true, new: true, runValidators: true, includeResultMetadata: true }
        );
        if (diagRes.lastErrorObject?.updatedExisting) summary.diagnosesUpdated++;
        else summary.diagnosesCreated++;
      }
    }

    res.json({ ok: true, summary });
  } catch (err) {
    next(err);
  }
}
