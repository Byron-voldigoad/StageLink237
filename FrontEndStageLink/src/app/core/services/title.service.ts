import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private titleSubject = new BehaviorSubject<string>('');
  title$ = this.titleSubject.asObservable();

  setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  // Titres par défaut pour chaque route
  public getRouteTitle(url: string): string {
    if (url.startsWith('/dashboard')) return 'Dashboard';
    if (url.startsWith('/stages')) return 'Offres de stage';
    if (url.startsWith('/sujets-examen')) return 'Sujets d\'examen';
    if (url.startsWith('/messages')) return 'Messages';
    if (url.startsWith('/profil')) return 'Profil';
    if (url.startsWith('/tutorats')) return 'Offres de tutorat';
    return 'StageLink';
  }
}
