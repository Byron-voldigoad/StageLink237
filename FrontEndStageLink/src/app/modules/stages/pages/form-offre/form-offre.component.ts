import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OffreStageService } from '../../services/offre-stage.service';
import { OffreStage } from '../../models/offre-stage.model';
import { EntrepriseService } from '../../../../services/entreprise.service';
import { Entreprise } from '../../../../models/entreprise.model';
import { Secteur } from '../../models/secteur.model';
import { environment } from 'src/environments/environment';

interface CompetenceGroup {
  label: string;
  competences: string[];
}

@Component({
  selector: 'app-form-offre',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './form-offre.component.html',
  styleUrls: ['./form-offre.component.css']
})
export class FormOffreComponent implements OnInit {
  offreForm: FormGroup;
  isEditMode = false;
  loading = false;
  error: string | null = null;
  selectedCompetences: string[] = [];
  entreprises: Entreprise[] = [];
  secteurs: Secteur[] = [];
  competenceGroups = [
    {
      label: 'Développement Web',
      competences: [
        'HTML/CSS',
        'JavaScript',
        'TypeScript',
        'Angular',
        'React',
        'Vue.js',
        'Node.js',
        'PHP',
        'Laravel',
        'Symfony',
        'Django',
        'Flask',
        'Express.js',
        'REST API',
        'GraphQL',
        'MySQL',
        'PostgreSQL',
        'MongoDB',
        'Git',
        'Docker'
      ]
    },
    {
      label: 'Design UI/UX',
      competences: [
        'Figma',
        'Adobe XD',
        'Sketch',
        'Photoshop',
        'Illustrator',
        'InDesign',
        'Prototypage',
        'Wireframing',
        'Design System',
        'Responsive Design',
        'Accessibilité',
        'User Research',
        'User Testing',
        'Design Thinking'
      ]
    },
    {
      label: 'Data Science',
      competences: [
        'Python',
        'R',
        'SQL',
        'Pandas',
        'NumPy',
        'Scikit-learn',
        'TensorFlow',
        'PyTorch',
        'Data Visualization',
        'Machine Learning',
        'Deep Learning',
        'NLP',
        'Big Data',
        'Hadoop',
        'Spark',
        'Tableau',
        'Power BI'
      ]
    },
    {
      label: 'Cloud Computing',
      competences: [
        'AWS',
        'Azure',
        'Google Cloud',
        'Docker',
        'Kubernetes',
        'Terraform',
        'CI/CD',
        'DevOps',
        'Linux',
        'Networking',
        'Security',
        'Serverless',
        'Microservices',
        'Cloud Architecture'
      ]
    },
    {
      label: 'Développement Mobile',
      competences: [
        'Android',
        'iOS',
        'React Native',
        'Flutter',
        'Swift',
        'Kotlin',
        'Java',
        'Xamarin',
        'Mobile UI/UX',
        'REST API',
        'Firebase',
        'Push Notifications',
        'App Store',
        'Play Store'
      ]
    },
    {
      label: 'Cybersécurité',
      competences: [
        'Sécurité réseau',
        'Pentesting',
        'Forensics',
        'Cryptographie',
        'OWASP',
        'ISO 27001',
        'GDPR',
        'Kali Linux',
        'Wireshark',
        'Metasploit',
        'Burp Suite',
        'Security Audit',
        'Incident Response'
      ]
    },
    {
      label: 'Intelligence Artificielle',
      competences: [
        'Python',
        'TensorFlow',
        'PyTorch',
        'Keras',
        'Machine Learning',
        'Deep Learning',
        'Computer Vision',
        'NLP',
        'Reinforcement Learning',
        'Data Mining',
        'Neural Networks',
        'AI Ethics',
        'Model Deployment'
      ]
    },
    {
      label: 'Gestion de Projet',
      competences: [
        'Agile',
        'Scrum',
        'Kanban',
        'Jira',
        'Trello',
        'Git',
        'CI/CD',
        'Documentation',
        'Risk Management',
        'Team Leadership',
        'Communication',
        'Project Planning',
        'Budget Management'
      ]
    }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private offreStageService: OffreStageService,
    private entrepriseService: EntrepriseService
  ) {
    this.offreForm = this.fb.group({
      id_entreprise: ['', Validators.required],
      titre: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      exigences: [''],
      duree_nombre: [null, [Validators.required, Validators.min(1)]],
      duree_unite: ['mois', Validators.required],
      localisation: [''],
      secteur_id: ['', Validators.required],
      remuneration: [null, [Validators.min(0)]],
      date_debut: [''],
      date_fin: [''],
      statut: ['en_attente']
    });
  }

  ngOnInit(): void {
    this.loadEntreprises();
    this.loadSecteurs();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadOffre(parseInt(id, 10));
    }
  }

  loadEntreprises(): void {
    this.entrepriseService.getAllEntreprises().subscribe({
      next: (entreprises: Entreprise[]) => {
        this.entreprises = entreprises;
      },
      error: (error: any) => {
        this.error = 'Erreur lors du chargement des entreprises';
        console.error('Erreur:', error);
      }
    });
  }

  loadSecteurs(): void {
    this.offreStageService['http'].get<Secteur[]>(`${environment.apiUrl}/secteurs`).subscribe({
      next: (secteurs) => this.secteurs = secteurs,
      error: () => this.secteurs = []
    });
  }

  loadOffre(id: number): void {
    this.loading = true;
    this.offreStageService.getOffreById(id).subscribe({
      next: (offre: OffreStage) => {
        // Extraire la durée en nombre et unité
        const dureeMatch = offre.duree?.match(/(\d+)\s*(\w+)/);
        const dureeNombre = dureeMatch ? parseInt(dureeMatch[1], 10) : null;
        const dureeUnite = dureeMatch ? dureeMatch[2].toLowerCase() : 'mois';

        // Formater les dates pour l'input date
        const dateDebut = offre.date_debut ? new Date(offre.date_debut).toISOString().split('T')[0] : '';
        const dateFin = offre.date_fin ? new Date(offre.date_fin).toISOString().split('T')[0] : '';

        // Mettre à jour le formulaire avec les valeurs formatées
        this.offreForm.patchValue({
          ...offre,
          duree_nombre: dureeNombre,
          duree_unite: dureeUnite,
          date_debut: dateDebut,
          date_fin: dateFin
        });

        // Mettre à jour les compétences
        this.selectedCompetences = offre.competences_requises?.split(',').map(c => c.trim()) || [];
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Erreur lors du chargement de l\'offre';
        this.loading = false;
        console.error('Erreur:', error);
      }
    });
  }

  addCompetence(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const competence = select.value;
    if (competence && !this.selectedCompetences.includes(competence)) {
      this.selectedCompetences.push(competence);
    }
    select.value = '';
  }

  removeCompetence(competence: string): void {
    this.selectedCompetences = this.selectedCompetences.filter(c => c !== competence);
  }

  updateDateFin(): void {
    const dateDebut = this.offreForm.get('date_debut')?.value;
    const dureeNombre = this.offreForm.get('duree_nombre')?.value;
    const dureeUnite = this.offreForm.get('duree_unite')?.value;

    if (dateDebut && dureeNombre) {
      const dateFin = new Date(dateDebut);
      if (dureeUnite === 'mois') {
        dateFin.setMonth(dateFin.getMonth() + dureeNombre);
      } else {
        dateFin.setDate(dateFin.getDate() + (dureeNombre * 7));
      }
      this.offreForm.patchValue({
        date_fin: dateFin.toISOString().split('T')[0]
      });
    }
  }

  onSubmit(): void {
    if (this.offreForm.valid) {
    this.loading = true;
      
      // Construire la durée à partir du nombre et de l'unité
      const dureeNombre = this.offreForm.get('duree_nombre')?.value;
      const dureeUnite = this.offreForm.get('duree_unite')?.value;
      const duree = `${dureeNombre} ${dureeUnite}`;

      const offreData: Partial<OffreStage> = {
        ...this.offreForm.value,
        duree,
        competences_requises: this.selectedCompetences.join(', ')
      };

      const id = this.route.snapshot.paramMap.get('id');
      const request = this.isEditMode && id
        ? this.offreStageService.updateOffre(parseInt(id, 10), offreData)
        : this.offreStageService.createOffre(offreData);

      request.subscribe({
      next: () => {
        this.router.navigate(['/stages']);
      },
        error: (error: any) => {
          this.error = 'Une erreur est survenue lors de l\'enregistrement de l\'offre';
        this.loading = false;
        console.error('Erreur:', error);
      }
    });
    }
  }
} 