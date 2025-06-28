import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TutoratService } from './tutorat.service';
import { Tutorat, CandidatureTutorat } from '../models/tutorat.model';

describe('TutoratService', () => {
  let service: TutoratService;
  let httpMock: HttpTestingController;

  const mockTutorat: Tutorat = {
    id_tutorat: 1,
    titre: 'Tutorat Mathématiques',
    description: 'Cours de mathématiques niveau lycée',
    domaine: 'Mathématiques',
    niveau: 'Lycée',
    date_debut: '2024-01-15',
    date_fin: '2024-03-15',
    tuteur_id: 1,
    localisation: 'Paris',
    statut: 'ouverte',
    tarif_horaire: 25,
    duree_seance: 60,
    nombre_seances: 10,
    prerequis: 'Bases en mathématiques',
    objectifs: 'Maîtriser les concepts fondamentaux',
    methode_pedagogique: 'Approche personnalisée',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  const mockCandidature: CandidatureTutorat = {
    id_candidature: 1,
    tutorat_id: 1,
    etudiant_id: 1,
    statut: 'en_attente',
    message_motivation: 'Je suis très motivé',
    date_candidature: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TutoratService]
    });
    service = TestBed.inject(TutoratService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return tutorats list', () => {
      const mockResponse = {
        data: [mockTutorat],
        current_page: 1,
        last_page: 1,
        total: 1
      };

      service.getAll().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should apply filters when provided', () => {
      const filters = { domaine: 'Mathématiques', niveau: 'Lycée' };
      const mockResponse = { data: [mockTutorat] };

      service.getAll(filters).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}?domaine=Math%C3%A9matiques&niveau=Ly%C3%A9e`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getById', () => {
    it('should return a specific tutorat', () => {
      service.getById(1).subscribe(tutorat => {
        expect(tutorat).toEqual(mockTutorat);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTutorat);
    });
  });

  describe('create', () => {
    it('should create a new tutorat', () => {
      const newTutorat = { ...mockTutorat, id_tutorat: undefined };

      service.create(newTutorat).subscribe(tutorat => {
        expect(tutorat).toEqual(mockTutorat);
      });

      const req = httpMock.expectOne(service['apiUrl']);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTutorat);
      req.flush(mockTutorat);
    });
  });

  describe('update', () => {
    it('should update an existing tutorat', () => {
      const updatedTutorat = { ...mockTutorat, titre: 'Tutorat Physique' };

      service.update(1, updatedTutorat).subscribe(tutorat => {
        expect(tutorat).toEqual(updatedTutorat);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedTutorat);
      req.flush(updatedTutorat);
    });
  });

  describe('delete', () => {
    it('should delete a tutorat', () => {
      service.delete(1).subscribe(() => {
        expect().nothing();
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('postuler', () => {
    it('should submit a candidature', () => {
      const candidature = {
        etudiant_id: 1,
        message_motivation: 'Je suis motivé',
        cv: null,
        lettre_motivation: null
      };

      service.postuler(1, candidature).subscribe(response => {
        expect(response).toEqual(mockCandidature);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/1/postuler`);
      expect(req.request.method).toBe('POST');
      req.flush(mockCandidature);
    });
  });

  describe('gererCandidature', () => {
    it('should manage a candidature', () => {
      const updatedCandidature = { ...mockCandidature, statut: 'acceptee' };

      service.gererCandidature(1, 1, 'acceptee').subscribe(response => {
        expect(response).toEqual(updatedCandidature);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/1/candidatures/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ statut: 'acceptee' });
      req.flush(updatedCandidature);
    });
  });

  describe('getStatistiques', () => {
    it('should return statistics', () => {
      const mockStats = {
        total: 10,
        ouverts: 5,
        pourvus: 3,
        clotures: 2,
        candidatures_total: 15,
        candidatures_en_attente: 8
      };

      service.getStatistiques().subscribe(stats => {
        expect(stats).toEqual(mockStats);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/statistiques`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStats);
    });
  });

  describe('getDomaines', () => {
    it('should return available domains', () => {
      const mockDomaines = ['Mathématiques', 'Physique', 'Chimie'];

      service.getDomaines().subscribe(domaines => {
        expect(domaines).toEqual(mockDomaines);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/domaines`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDomaines);
    });
  });

  describe('getNiveaux', () => {
    it('should return available levels', () => {
      const mockNiveaux = ['Collège', 'Lycée', 'Bac'];

      service.getNiveaux().subscribe(niveaux => {
        expect(niveaux).toEqual(mockNiveaux);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/niveaux`);
      expect(req.request.method).toBe('GET');
      req.flush(mockNiveaux);
    });
  });
}); 