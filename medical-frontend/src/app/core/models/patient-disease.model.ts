import { Disease } from './disease.model';

export type DiagnosisStatus = 'active' | 'resolved' | 'chronic';

export interface PatientDisease {
  id?: string;
  patient: string;
  disease: Disease;
  dateOfDiagnosis: string;
  status: DiagnosisStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewDiagnosisPayload {
  diseaseId: string;
  dateOfDiagnosis: string;
  status: DiagnosisStatus;
}

export const DIAGNOSIS_STATUS_LABEL: Record<DiagnosisStatus, string> = {
  active: 'Activa',
  resolved: 'Resolvida',
  chronic: 'Crónica'
};
