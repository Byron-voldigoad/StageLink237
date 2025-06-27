import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

  getCoordinatesFromNominatim(address: string): Observable<{ lat: number; lng: number }> {
    if (!address) {
      console.warn('Adresse vide fournie au service de géocodification');
      return throwError(() => new Error('Adresse vide'));
    }

    const params = {
      q: address,
      format: 'json',
      limit: '1',
      countrycodes: 'cm', // Limite la recherche au Cameroun
      addressdetails: '1'
    };

    console.log('Recherche de coordonnées pour:', address);

    return this.http.get<any[]>(this.nominatimUrl, { params }).pipe(
      map(response => {
        if (response && response.length > 0) {
          console.log('Coordonnées trouvées:', response[0]);
          return {
            lat: parseFloat(response[0].lat),
            lng: parseFloat(response[0].lon)
          };
        }
        console.warn('Aucune coordonnée trouvée pour:', address);
        throw new Error(`Aucune coordonnée trouvée pour l'adresse: ${address}`);
      }),
      catchError(error => {
        console.error('Erreur lors de la géocodification:', error);
        return throwError(() => new Error(`Erreur lors de la géocodification: ${error.message}`));
      })
    );
  }
} 