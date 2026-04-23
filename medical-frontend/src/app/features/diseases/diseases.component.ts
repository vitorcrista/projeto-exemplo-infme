import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Disease } from '../../core/models/disease.model';
import { DiseaseService } from '../../core/services/disease.service';

@Component({
  selector: 'app-diseases',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './diseases.component.html',
  styleUrl: './diseases.component.css'
})
export class DiseasesComponent implements OnInit {
  private diseaseService = inject(DiseaseService);

  diseases: Disease[] = [];
  newDisease: Disease = this.blank();

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.diseaseService.getDiseases().subscribe((list) => (this.diseases = list));
  }

  add(): void {
    if (!this.newDisease.name.trim()) return;
    this.diseaseService.create(this.newDisease).subscribe((created) => {
      if (created) {
        this.diseases = [...this.diseases, created].sort((a, b) => a.name.localeCompare(b.name));
        this.newDisease = this.blank();
      }
    });
  }

  remove(disease: Disease): void {
    if (!disease.id) return;
    this.diseases = this.diseases.filter((d) => d.id !== disease.id);
    this.diseaseService.delete(disease.id).subscribe();
  }

  private blank(): Disease {
    return { name: '', description: '' };
  }
}
