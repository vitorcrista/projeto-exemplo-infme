import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

import { Disease } from '../models/disease.model';

@Injectable({ providedIn: 'root' })
export class DiseaseService {
  private http = inject(HttpClient);

  private readonly baseUrl = '/api/diseases';

  getDiseases(): Observable<Disease[]> {
    return this.http
      .get<Disease[]>(this.baseUrl)
      .pipe(catchError(this.handleError<Disease[]>([])));
  }

  getDisease(id: string): Observable<Disease | undefined> {
    return this.http
      .get<Disease>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError<Disease>()));
  }

  create(disease: Disease): Observable<Disease | undefined> {
    return this.http
      .post<Disease>(this.baseUrl, disease)
      .pipe(catchError(this.handleError<Disease>()));
  }

  update(disease: Disease): Observable<Disease | undefined> {
    return this.http
      .put<Disease>(`${this.baseUrl}/${disease.id}`, disease)
      .pipe(catchError(this.handleError<Disease>()));
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError<unknown>()));
  }

  private handleError<T>(fallback?: T) {
    return (error: unknown): Observable<T> => {
      console.error('[DiseaseService]', error);
      return of(fallback as T);
    };
  }
}
