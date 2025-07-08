import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'etudiant' | 'entreprise' | 'admin';
  etudiant_id?: number;
  entreprise_id?: number;
}

interface LoginResponse {
  user: User;
  token: string;
  etudiant_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
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
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        const userWithEtudiantId: User = { ...response.user, etudiant_id: response.etudiant_id };
        localStorage.setItem('user', JSON.stringify(userWithEtudiantId));
        this.currentUserSubject.next(userWithEtudiantId);
      }),
      map(response => ({ ...response.user, etudiant_id: response.etudiant_id }))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }
} 