import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TutoratService } from '../../services/tutorat.service';
import { Tutorat } from '../../models/tutorat.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-tutorat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-tutorat.component.html',
  styleUrls: ['./form-tutorat.component.scss']
})
export class FormTutoratComponent {
  tutorat: Tutorat = {
    id: '',
    titre: '',
    description: '',
    domaine: '',
    niveau: '',
    dateDebut: new Date(),
    dateFin: new Date(),
    tuteur: ''
  };

  constructor(private tutoratService: TutoratService, private router: Router) {}

  onSubmit() {
    this.tutorat.id = Date.now().toString();
    this.tutoratService.create(this.tutorat).subscribe(() => {
      this.router.navigate(['/tutorats']);
    });
  }
}
