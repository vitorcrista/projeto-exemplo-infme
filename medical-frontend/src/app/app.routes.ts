import { Routes } from '@angular/router';

import { LoginComponent } from './features/login/login.component';
import { PatientsComponent } from './features/patients/patients.component';
import { PatientDetailComponent } from './features/patient-detail/patient-detail.component';
import { DiseasesComponent } from './features/diseases/diseases.component';
import { DiseaseDetailComponent } from './features/disease-detail/disease-detail.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/patients', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'patients', component: PatientsComponent, canActivate: [authGuard] },
  { path: 'detail/:id', component: PatientDetailComponent, canActivate: [authGuard] },
  { path: 'diseases', component: DiseasesComponent, canActivate: [authGuard] },
  { path: 'diseases/:id', component: DiseaseDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/patients' }
];
