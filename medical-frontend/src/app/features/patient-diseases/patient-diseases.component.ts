import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Disease } from '../../core/models/disease.model';
import {
  DIAGNOSIS_STATUS_LABEL,
  DiagnosisStatus,
  NewDiagnosisPayload,
  PatientDisease
} from '../../core/models/patient-disease.model';
import { DiseaseService } from '../../core/services/disease.service';
import { PatientDiseaseService } from '../../core/services/patient-disease.service';

@Component({
  selector: 'app-patient-diseases',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './patient-diseases.component.html',
  styleUrl: './patient-diseases.component.css'
})
export class PatientDiseasesComponent implements OnInit, OnChanges {
  @Input({ required: true }) patientId!: string;

  private patientDiseaseService = inject(PatientDiseaseService);
  private diseaseService = inject(DiseaseService);

  diagnoses: PatientDisease[] = [];
  catalog: Disease[] = [];

  readonly statusLabel = DIAGNOSIS_STATUS_LABEL;
  readonly statusOptions: DiagnosisStatus[] = ['active', 'chronic', 'resolved'];

  showForm = false;
  draft: NewDiagnosisPayload = this.blankDraft();

  ngOnInit(): void {
    this.diseaseService.getDiseases().subscribe((list) => (this.catalog = list));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patientId'] && this.patientId) this.load();
  }

  load(): void {
    this.patientDiseaseService
      .listForPatient(this.patientId)
      .subscribe((list) => (this.diagnoses = list));
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.draft = this.blankDraft();
  }

  availableCatalog(): Disease[] {
    const assigned = new Set(this.diagnoses.map((d) => d.disease?.id));
    return this.catalog.filter((d) => !assigned.has(d.id));
  }

  add(): void {
    if (!this.draft.diseaseId || !this.draft.dateOfDiagnosis) return;
    this.patientDiseaseService.addToPatient(this.patientId, this.draft).subscribe((created) => {
      if (created) {
        this.diagnoses = [created, ...this.diagnoses];
        this.draft = this.blankDraft();
        this.showForm = false;
      }
    });
  }

  changeStatus(entry: PatientDisease, status: DiagnosisStatus): void {
    if (!entry.id || entry.status === status) return;
    this.patientDiseaseService.updateStatus(entry.id, status).subscribe((updated) => {
      if (updated) {
        this.diagnoses = this.diagnoses.map((d) => (d.id === updated.id ? updated : d));
      }
    });
  }

  remove(entry: PatientDisease): void {
    if (!entry.id) return;
    this.diagnoses = this.diagnoses.filter((d) => d.id !== entry.id);
    this.patientDiseaseService.remove(entry.id).subscribe();
  }

  private blankDraft(): NewDiagnosisPayload {
    return {
      diseaseId: '',
      dateOfDiagnosis: new Date().toISOString().substring(0, 10),
      status: 'active'
    };
  }
}
