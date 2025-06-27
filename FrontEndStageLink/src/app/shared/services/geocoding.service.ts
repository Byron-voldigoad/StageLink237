import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  constructor(private http: HttpClient) {}

  getCoordinatesFromNominatim(address: string, latitude?: number, longitude?: number): Observable<{ lat: number; lng: number }> {
    if (latitude && longitude) {
      console.log('Utilisation des coordonnées directes:', { lat: latitude, lng: longitude });
      return of({ lat: latitude, lng: longitude });
    }

    // Si pas de coordonnées directes, utiliser les coordonnées par défaut des villes principales
    const defaultCoordinates = {
      'Yaoundé': { lat: 3.8480, lng: 11.5021 },
      'Douala': { lat: 4.0511, lng: 9.7679 }
    };

    for (const [ville, coords] of Object.entries(defaultCoordinates)) {
      if (address.includes(ville)) {
        console.log('Utilisation des coordonnées par défaut pour', ville, coords);
        return of(coords);
      }
    }

    // Si aucune ville n'est trouvée, utiliser Yaoundé comme fallback
    console.log('Aucune ville trouvée, utilisation de Yaoundé comme fallback');
    return of(defaultCoordinates['Yaoundé']);
  }
} 