import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { Doctor, LoginResponse } from '../models/doctor.model';

const TOKEN_KEY = 'medical.token';
const DOCTOR_KEY = 'medical.doctor';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  readonly doctor = signal<Doctor | null>(this.loadDoctor());

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { email, password }).pipe(
      tap((res) => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(DOCTOR_KEY, JSON.stringify(res.doctor));
        this.doctor.set(res.doctor);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(DOCTOR_KEY);
    this.doctor.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  private loadDoctor(): Doctor | null {
    const raw = localStorage.getItem(DOCTOR_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Doctor;
    } catch {
      return null;
    }
  }
}
