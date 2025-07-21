import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        // On stocke l'utilisateur enrichi avec etudiant_id
        const userWithEtudiantId = { ...response.user, etudiant_id: response.etudiant_id };
        localStorage.setItem('user', JSON.stringify(userWithEtudiantId));
        this.userSubject.next(userWithEtudiantId);
      })
    );
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem('user');
        this.userSubject.next(null);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUser(): any {
    return this.userSubject.value;
  }

  setUser(user: any) {
    this.userSubject.next(user);
  }

  getEtudiantId(): number | null {
    const user = this.getUser();
    return user && user.etudiant_id ? user.etudiant_id : null;
  }

  registerUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/utilisateurs`, data);
  }
}
