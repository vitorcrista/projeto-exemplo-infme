import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Disease } from '../../core/models/disease.model';
import { DiseaseService } from '../../core/services/disease.service';

@Component({
  selector: 'app-disease-detail',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './disease-detail.component.html',
  styleUrl: './disease-detail.component.css'
})
export class DiseaseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private diseaseService = inject(DiseaseService);
  private location = inject(Location);

  disease?: Disease;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.diseaseService.getDisease(id).subscribe((d) => (this.disease = d));
  }

  save(): void {
    if (!this.disease) return;
    this.diseaseService.update(this.disease).subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}
