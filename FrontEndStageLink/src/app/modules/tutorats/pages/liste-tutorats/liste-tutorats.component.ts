import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TutoratService } from '../../services/tutorat.service';
import { Tutorat } from '../../models/tutorat.model';

@Component({
  selector: 'app-liste-tutorats',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './liste-tutorats.component.html',
  styleUrls: ['./liste-tutorats.component.scss']
})
export class ListeTutoratsComponent implements OnInit {
  tutorats: Tutorat[] = [];

  constructor(private tutoratService: TutoratService) {}

  ngOnInit() {
    this.tutoratService.getAll().subscribe(data => this.tutorats = data);
  }
}
