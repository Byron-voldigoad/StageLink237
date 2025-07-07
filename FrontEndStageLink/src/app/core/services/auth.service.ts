import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'etudiant' | 'entreprise' | 'admin';
  etudiant_id?: number;
  entreprise_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Simuler un utilisateur connecté pour les tests
    const mockUser: User = {
      id: 1,
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      role: 'etudiant',
      etudiant_id: 1
    };
    this.currentUserSubject.next(mockUser);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentEtudiantId(): number | null {
    const user = this.getCurrentUser();
    return user?.role === 'etudiant' ? user.etudiant_id || null : null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  isEtudiant(): boolean {
    return this.getCurrentUser()?.role === 'etudiant';
  }

  isEntreprise(): boolean {
    return this.getCurrentUser()?.role === 'entreprise';
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'admin';
  }

  login(email: string, password: string): Observable<User> {
    // Simulation d'une connexion
    return new Observable(observer => {
      setTimeout(() => {
        const mockUser: User = {
          id: 1,
          nom: 'Doe',
          prenom: 'John',
          email: email,
          role: 'etudiant',
          etudiant_id: 1
        };
        this.currentUserSubject.next(mockUser);
        observer.next(mockUser);
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }
} 