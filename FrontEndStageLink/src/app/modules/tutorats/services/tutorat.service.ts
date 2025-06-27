import { Injectable } from '@angular/core';
import { Tutorat } from '../models/tutorat.model';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TutoratService {
  private tutorats: Tutorat[] = [];

  getAll(): Observable<Tutorat[]> {
    return of(this.tutorats);
  }

  getById(id: string): Observable<Tutorat | undefined> {
    return of(this.tutorats.find(t => t.id === id));
  }

  create(tutorat: Tutorat): Observable<Tutorat> {
    this.tutorats.push(tutorat);
    return of(tutorat);
  }

  update(id: string, tutorat: Tutorat): Observable<Tutorat | undefined> {
    const idx = this.tutorats.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.tutorats[idx] = tutorat;
      return of(tutorat);
    }
    return of(undefined);
  }

  delete(id: string): Observable<boolean> {
    const idx = this.tutorats.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.tutorats.splice(idx, 1);
      return of(true);
    }
    return of(false);
  }

  postuler(id: string, candidatId: string): Observable<boolean> {
    // À implémenter : logique de postulation
    return of(true);
  }
}
