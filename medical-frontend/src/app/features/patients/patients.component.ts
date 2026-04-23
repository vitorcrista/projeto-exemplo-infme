import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Patient } from '../../core/models/patient.model';
import { PatientService } from '../../core/services/patient.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit {
  private patientService = inject(PatientService);

  patients: Patient[] = [];
  newPatient: Patient = this.blankPatient();

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.patientService.getPatients().subscribe((list) => (this.patients = list));
  }

  add(): void {
    const p = this.newPatient;
    if (!p.firstName.trim() || !p.lastName.trim() || !p.snsNumber.trim() || !p.dateOfBirth) {
      return;
    }
    this.patientService.create(p).subscribe((created) => {
      if (created) {
        this.patients = [...this.patients, created];
        this.newPatient = this.blankPatient();
      }
    });
  }

  remove(patient: Patient): void {
    if (!patient.id) return;
    this.patients = this.patients.filter((p) => p.id !== patient.id);
    this.patientService.delete(patient.id).subscribe();
  }

  private blankPatient(): Patient {
    return {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'O',
      snsNumber: ''
    };
  }
}
