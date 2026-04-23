import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

import {
  DiagnosisStatus,
  NewDiagnosisPayload,
  PatientDisease
} from '../models/patient-disease.model';

@Injectable({ providedIn: 'root' })
export class PatientDiseaseService {
  private http = inject(HttpClient);

  listForPatient(patientId: string): Observable<PatientDisease[]> {
    return this.http
      .get<PatientDisease[]>(`/api/patients/${patientId}/diseases`)
      .pipe(catchError(this.handleError<PatientDisease[]>([])));
  }

  addToPatient(
    patientId: string,
    payload: NewDiagnosisPayload
  ): Observable<PatientDisease | undefined> {
    return this.http
      .post<PatientDisease>(`/api/patients/${patientId}/diseases`, payload)
      .pipe(catchError(this.handleError<PatientDisease>()));
  }

  updateStatus(id: string, status: DiagnosisStatus): Observable<PatientDisease | undefined> {
    return this.http
      .patch<PatientDisease>(`/api/patient-diseases/${id}`, { status })
      .pipe(catchError(this.handleError<PatientDisease>()));
  }

  remove(id: string): Observable<unknown> {
    return this.http
      .delete(`/api/patient-diseases/${id}`)
      .pipe(catchError(this.handleError<unknown>()));
  }

  private handleError<T>(fallback?: T) {
    return (error: unknown): Observable<T> => {
      console.error('[PatientDiseaseService]', error);
      return of(fallback as T);
    };
  }
}
