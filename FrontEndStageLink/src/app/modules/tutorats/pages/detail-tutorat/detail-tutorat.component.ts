import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TutoratService } from '../../services/tutorat.service';
import { Tutorat } from '../../models/tutorat.model';

@Component({
  selector: 'app-detail-tutorat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-tutorat.component.html',
  styleUrls: ['./detail-tutorat.component.scss']
})
export class DetailTutoratComponent implements OnInit {
  tutorat?: Tutorat;

  constructor(private route: ActivatedRoute, private tutoratService: TutoratService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.tutoratService.getById(id).subscribe(data => this.tutorat = data);
  }

  postuler() {
    if (this.tutorat) {
      // Remplacer 'candidatId' par la vraie gestion utilisateur
      this.tutoratService.postuler(this.tutorat.id, 'candidatId').subscribe();
      alert('Votre candidature a été envoyée !');
    }
  }
}
