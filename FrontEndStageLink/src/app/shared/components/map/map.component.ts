import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { GeocodingService } from '../../services/geocoding.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="map" class="h-full w-full"></div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() latitude: number = 0;
  @Input() longitude: number = 0;
  @Input() locationName: string = '';
  @Input() zoom: number = 13;

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  constructor(private geocodingService: GeocodingService) {}

  ngOnInit(): void {
    // Initialisation des icônes Leaflet
    const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
    const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
    const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    try {
      // Vérifier si une carte existe déjà et la supprimer
      const container = document.getElementById('map');
      if (container) {
        container.innerHTML = '';
      }

      // Initialiser la carte avec les coordonnées par défaut si aucune n'est fournie
      const defaultLat = this.latitude || 48.8566; // Paris par défaut
      const defaultLng = this.longitude || 2.3522;

      // Créer la carte avec des options optimisées
      this.map = L.map('map', {
        center: [defaultLat, defaultLng],
        zoom: this.zoom,
        zoomControl: false,
        attributionControl: false,
        preferCanvas: true, // Améliore les performances
        renderer: L.canvas() // Utilise le rendu Canvas pour de meilleures performances
      });

      // Ajouter le contrôle de zoom personnalisé
      L.control.zoom({
        position: 'topright'
      }).addTo(this.map);

      // Ajouter la couche de tuiles OpenStreetMap avec des options optimisées
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        detectRetina: true,
        updateWhenIdle: true,
        updateWhenZooming: false,
        maxNativeZoom: 19
      }).addTo(this.map);

      // Forcer un redimensionnement de la carte pour s'assurer qu'elle s'affiche correctement
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 100);

      // Si des coordonnées sont fournies, ajouter un marqueur
      if (this.latitude && this.longitude) {
        this.addMarker(this.latitude, this.longitude, this.locationName);
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  loadCoordinates(offre: any) {
    if (offre.entreprise) {
      this.geocodingService.getCoordinatesFromNominatim(
        offre.entreprise.adresse,
        offre.entreprise.latitude,
        offre.entreprise.longitude
      ).subscribe(
        (coords: { lat: number; lng: number }) => {
          this.addMarker(coords.lat, coords.lng, offre);
        },
        (error: any) => {
          console.error('Erreur lors de la géocodification:', error);
        }
      );
    }
  }

  private addMarker(latitude: number, longitude: number, offre: any) {
    if (this.map) {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker([latitude, longitude])
        .addTo(this.map)
        .bindPopup(offre.entreprise.nom)
        .openPopup();
      this.map.setView([latitude, longitude], this.zoom);
    }
  }
} 