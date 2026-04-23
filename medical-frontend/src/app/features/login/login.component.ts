import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../core/services/auth.service';

interface DemoCredential {
  label: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error = '';

  readonly demoCredentials: DemoCredential[] = [
    { label: 'Dra. Ana Moreira',  email: 'ana@hospital.pt',   password: 'demo1234' },
    { label: 'Dr. Bruno Lopes',   email: 'bruno@hospital.pt', password: 'demo1234' }
  ];

  submit(): void {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.error = '';
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/patients']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = err.error?.error?.message || 'Não foi possível entrar';
      }
    });
  }

  useDemo(cred: DemoCredential): void {
    this.email = cred.email;
    this.password = cred.password;
  }
}
