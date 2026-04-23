import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

import { Patient } from '../models/patient.model';

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

  private handleError<T>(fallback?: T) {
    return (error: unknown): Observable<T> => {
      console.error('[PatientService]', error);
      return of(fallback as T);
    };
  }
}
