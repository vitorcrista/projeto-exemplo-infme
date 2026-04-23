import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Patient } from '../../core/models/patient.model';
import { PatientService } from '../../core/services/patient.service';
import { PatientDiseasesComponent } from '../patient-diseases/patient-diseases.component';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [FormsModule, PatientDiseasesComponent],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.css'
})
export class PatientDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);
  private location = inject(Location);

  patient?: Patient;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.patientService.getPatient(id).subscribe((p) => (this.patient = p));
  }

  save(): void {
    if (!this.patient) return;
    this.patientService.update(this.patient).subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }

  get dateOfBirthInput(): string {
    return this.patient?.dateOfBirth ? this.patient.dateOfBirth.substring(0, 10) : '';
  }
  set dateOfBirthInput(value: string) {
    if (this.patient) this.patient.dateOfBirth = value;
  }
}
