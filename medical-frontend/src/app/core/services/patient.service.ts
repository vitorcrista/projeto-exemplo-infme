import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

import { Patient } from '../models/patient.model';

export interface ValidationError {
  line?: number;
  message: string;
}

export interface ImportSummary {
  patientsCreated: number;
  patientsUpdated: number;
  diseasesCreated: number;
  diagnosesCreated: number;
  diagnosesUpdated: number;
}

export interface ImportResult {
  ok: boolean;
  summary?: ImportSummary;
  message?: string;
  validationErrors?: ValidationError[];
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);

  private readonly baseUrl = '/api/patients';

  getPatients(): Observable<Patient[]> {
    return this.http
      .get<Patient[]>(this.baseUrl)
      .pipe(catchError(this.handleError<Patient[]>([])));
  }

  getPatient(id: string): Observable<Patient | undefined> {
    return this.http
      .get<Patient>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError<Patient>()));
  }

  create(patient: Patient): Observable<Patient | undefined> {
    return this.http
      .post<Patient>(this.baseUrl, patient)
      .pipe(catchError(this.handleError<Patient>()));
  }

  update(patient: Patient): Observable<Patient | undefined> {
    return this.http
      .put<Patient>(`${this.baseUrl}/${patient.id}`, patient)
      .pipe(catchError(this.handleError<Patient>()));
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError<unknown>()));
  }

  /** Apaga todos os pacientes e diagnósticos do médico autenticado. */
  deleteAll(): Observable<{ patients: number; diagnoses: number } | undefined> {
    return this.http
      .delete<{ ok: boolean; deleted: { patients: number; diagnoses: number } }>(this.baseUrl)
      .pipe(
        map((res) => res.deleted),
        catchError(this.handleError<{ patients: number; diagnoses: number }>())
      );
  }

  /** Obtém a exportação XML (pacientes + diagnósticos) como Blob para download. */
  exportXml(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export.xml`, { responseType: 'blob' });
  }

  /**
   * Envia um XML para validação contra o XSD e importação.
   * Em caso de XML inválido (422) devolve um resultado com os erros de validação,
   * em vez de propagar o erro HTTP.
   */
  importXml(xml: string): Observable<ImportResult> {
    return this.http
      .post<{ ok: boolean; summary: ImportSummary }>(`${this.baseUrl}/import`, xml, {
        headers: { 'Content-Type': 'application/xml' }
      })
      .pipe(
        map((res) => ({ ok: true, summary: res.summary }) as ImportResult),
        catchError((err: HttpErrorResponse) => {
          const body = err.error as
            | { error?: { message?: string; validationErrors?: ValidationError[] } }
            | undefined;
          return of<ImportResult>({
            ok: false,
            message: body?.error?.message ?? 'Falha na importação do XML',
            validationErrors: body?.error?.validationErrors ?? []
          });
        })
      );
  }

  private handleError<T>(fallback?: T) {
    return (error: unknown): Observable<T> => {
      console.error('[PatientService]', error);
      return of(fallback as T);
    };
  }
}
