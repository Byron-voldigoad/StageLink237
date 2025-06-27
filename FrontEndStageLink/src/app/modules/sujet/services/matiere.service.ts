import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatiereService {
  private apiUrl = `${environment.apiUrl}/matieres`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => Array.isArray(response) ? response : response.data)
    );
  }
} 