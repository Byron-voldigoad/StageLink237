import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { UtilisateursService } from '../../modules/utilisateurs/services/utilisateurs.services';
import { environment } from '../../../environments/environment';
import { ProfilTuteurComponent } from './profil-tuteur/profil-tuteur.component';
import { ProfilEtudiantComponent } from './profil-etudiant/profil-etudiant.component';
import { ProfilEntrepriseComponent } from './profil-entreprise/profil-entreprise.component';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ProfilTuteurComponent,
    ProfilEtudiantComponent,
    ProfilEntrepriseComponent
  ],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  user: any = null;
  role: string = '';
  loading: boolean = true;
  error: string | null = null;
  adminSuccess: string | null = null;
  adminError: string | null = null;
  showEditModal: boolean = false;
  editUser: any = {};
  editPhotoPreview: string | null = null;
  tofUrl = 'http://localhost:8000/storage/';
  
  // Types pour les profils spécifiques
  private profilTuteur: any = null;
  private profilEtudiant: any = null;
  private entreprise: any = null;

  constructor(
    private authService: AuthService, 
    private utilisateursService: UtilisateursService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    try {
      // Récupérer l'utilisateur connecté
      this.user = this.authService.getUser();
      if (!this.user) {
        throw new Error('Aucun utilisateur connecté');
      }
      
      // Détecter le rôle principal
      this.role = this.detectRole(this.user);
      
      // Charger les données spécifiques au profil selon le rôle
      try {
        if (this.role === 'tuteur') {
          this.profilTuteur = await this.loadProfilTuteur();
          this.user.profilTuteur = this.profilTuteur;
        } else if (this.role === 'etudiant') {
          this.profilEtudiant = await this.loadProfilEtudiant();
          this.user.profilEtudiant = this.profilEtudiant;
        } else if (this.role === 'entreprise') {
          this.entreprise = await this.loadProfilEntreprise();
          this.user.entreprise = this.entreprise;
        }
      } catch (profileError) {
        console.error(`Erreur lors du chargement du profil ${this.role}:`, profileError);
        this.error = `Impossible de charger les données du profil. Veuillez réessayer plus tard.`;
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      this.error = 'Une erreur est survenue lors du chargement de votre profil.';
    } finally {
      this.loading = false;
    }
  }

  private async loadProfilTuteur() {
    try {
      const response = await this.http.get<any>(`${environment.apiUrl}/profil-tuteur/utilisateur/${this.user.id_utilisateur}`).toPromise();
      if (response && response.success && response.data) {
        return response.data;
      } else if (response && !response.success) {
        console.warn('Aucun profil tuteur trouvé pour cet utilisateur');
        return {};
      }
      return {};
    } catch (error) {
      console.error('Erreur lors du chargement du profil tuteur:', error);
      this.error = 'Erreur lors du chargement du profil tuteur. Veuillez réessayer plus tard.';
      return {};
    }
  }

  private async loadProfilEtudiant() {
    try {
      const response = await this.http.get<any>(`${environment.apiUrl}/profil-etudiant/utilisateur/${this.user.id_utilisateur}`).toPromise();
      if (response && response.success && response.data) {
        return response.data;
      } else if (response && !response.success) {
        console.warn('Aucun profil étudiant trouvé pour cet utilisateur');
        return {};
      }
      return {};
    } catch (error) {
      console.error('Erreur lors du chargement du profil étudiant:', error);
      this.error = 'Erreur lors du chargement du profil étudiant. Veuillez réessayer plus tard.';
      return {};
    }
  }

  private async loadProfilEntreprise() {
    try {
      const response = await this.http.get<any>(`${environment.apiUrl}/entreprise/${this.user.id_utilisateur}`).toPromise();
      if (response && response.data) {
        return response.data;
      }
      return {};
    } catch (error) {
      console.error('Erreur lors du chargement du profil entreprise:', error);
      return {};
    }
  }

  detectRole(user: any): string {
    if (!user || !user.roles) return '';
    if (user.roles.some((r: any) => r.nom_role === 'admin')) return 'admin';
    if (user.roles.some((r: any) => r.nom_role === 'tuteur')) return 'tuteur';
    if (user.roles.some((r: any) => r.nom_role === 'entreprise')) return 'entreprise';
    if (user.roles.some((r: any) => r.nom_role === 'etudiant')) return 'etudiant';
    return '';
  }

  openEditModal() {
    this.editUser = { ...this.user };
    this.editPhotoPreview = this.user?.photo ? this.user.photo : null;
    // Pré-remplir les champs spécifiques selon le rôle
    if (this.role === 'etudiant' && this.user.profilEtudiant) {
      Object.assign(this.editUser, this.user.profilEtudiant);
    } else if (this.role === 'tuteur' && this.user.profilTuteur) {
      Object.assign(this.editUser, this.user.profilTuteur);
    } else if (this.role === 'entreprise' && this.user.entreprise) {
      Object.assign(this.editUser, this.user.entreprise);
      // Réseaux sociaux à aplatir pour le formulaire
      if (this.user.entreprise.reseaux_sociaux) {
        Object.assign(this.editUser, this.user.entreprise.reseaux_sociaux);
      }
    }
    this.showEditModal = true;
    this.adminSuccess = null;
    this.adminError = null;
  }
  closeEditModal() {
    this.showEditModal = false;
    this.editUser = {};
    this.editPhotoPreview = null;
  }
  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Fichier sélectionné :', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      
      // Vérifier la taille du fichier (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.adminError = 'La taille du fichier ne doit pas dépasser 2MB';
        return;
      }
      
      // Vérifier le type de fichier
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)$/)) {
        this.adminError = 'Seuls les fichiers JPG, PNG et GIF sont autorisés';
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editPhotoPreview = e.target.result;
        this.adminError = null; // Effacer les erreurs précédentes
      };
      
      reader.onerror = (error) => {
        console.error('Erreur lors de la lecture du fichier :', error);
        this.adminError = 'Erreur lors de la lecture du fichier';
      };
      
      reader.readAsDataURL(file);
      this.editUser.photoFile = file;
    } else {
      console.warn('Aucun fichier sélectionné');
    }
  }
  onCvSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        this.adminError = 'Le CV ne doit pas dépasser 2 Mo';
        return;
      }
      if (file.type !== 'application/pdf') {
        this.adminError = 'Seuls les fichiers PDF sont autorisés pour le CV';
        return;
      }
      this.editUser.cvFile = file;
      this.editUser.cvFileName = file.name;
      this.adminError = null;
    } else {
      this.editUser.cvFile = null;
      this.editUser.cvFileName = null;
    }
  }
  // Validation de l'email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    return emailRegex.test(email);
  }

  // Validation du numéro de téléphone
  isValidPhone(phone: string): boolean {
    if (!phone) return true; // Le téléphone est optionnel
    const phoneRegex = /^[0-9+\s]*$/;
    return phoneRegex.test(phone);
  }

  onSubmitAdmin() {
    this.adminSuccess = null;
    this.adminError = null;

    // Validation des champs génériques
    if (!this.isValidEmail(this.editUser.email)) {
      this.adminError = 'Veuillez entrer une adresse email valide';
      return;
    }
    if (this.editUser.telephone && !this.isValidPhone(this.editUser.telephone)) {
      this.adminError = 'Le numéro de téléphone ne doit contenir que des chiffres et des espaces';
      return;
    }

    // 1. Si photo, on la met à jour via la route utilisateur
    if (this.editUser.photoFile) {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('photo', this.editUser.photoFile, this.editUser.photoFile.name);
      formData.append('nom', this.editUser.nom || '');
      formData.append('prenom', this.editUser.prenom || '');
      formData.append('email', this.editUser.email || '');
      if (this.editUser.telephone) {
        formData.append('telephone', this.editUser.telephone);
      }
      this.http.post<any>(`${environment.apiUrl}/utilisateurs/${this.user.id_utilisateur}`, formData).subscribe({
        next: (response: any) => {
          // On continue la modification du profil spécifique après la photo
          this.submitProfilSpecifique();
        },
        error: (err: any) => {
          this.adminError = err.error?.message || 'Erreur lors de la mise à jour de la photo';
        }
      });
    } else {
      // Pas de photo à mettre à jour, on passe directement à la suite
      this.submitProfilSpecifique();
    }
  }

  submitProfilSpecifique() {
    // Préparer les données à envoyer
    let data: any = {
      nom: this.editUser.nom,
      prenom: this.editUser.prenom,
      email: this.editUser.email,
      telephone: this.editUser.telephone
    };
    if (this.role === 'etudiant') {
      data = {
        ...data,
        niveau_etude: this.editUser.niveau_etude,
        etablissement: this.editUser.etablissement,
        specialite: this.editUser.specialite,
        objectifs: this.editUser.objectifs,
        adresse: this.editUser.adresse,
        ville: this.editUser.ville,
        code_postal: this.editUser.code_postal
      };
    } else if (this.role === 'tuteur') {
      data = {
        ...data,
        specialites: this.editUser.specialites,
        experience_annees: this.editUser.experience_annees,
        tarif_horaire: this.editUser.tarif_horaire,
        bio: this.editUser.bio,
        diplomes: this.editUser.diplomes,
        methodes_pedagogiques: this.editUser.methodes_pedagogiques,
        qualifications: this.editUser.qualifications,
        certifications: this.editUser.certifications,
        disponible: this.editUser.disponible,
        ville: this.editUser.ville,
        code_postal: this.editUser.code_postal
      };
    } else if (this.role === 'entreprise') {
      data = {
        ...data,
        nom_entreprise: this.editUser.nom_entreprise,
        siret: this.editUser.siret,
        secteur_activite: this.editUser.secteur_activite,
        effectif: this.editUser.effectif,
        annee_creation: this.editUser.annee_creation,
        site_web: this.editUser.site_web,
        description: this.editUser.description,
        adresse: this.editUser.adresse,
        code_postal: this.editUser.code_postal,
        ville: this.editUser.ville,
        pays: this.editUser.pays,
        telephone: this.editUser.telephone,
        email_contact: this.editUser.email_contact,
        statut_juridique: this.editUser.statut_juridique,
        tva_intracom: this.editUser.tva_intracom,
        reseaux_sociaux: {
          linkedin: this.editUser.linkedin,
          twitter: this.editUser.twitter,
          facebook: this.editUser.facebook,
          instagram: this.editUser.instagram,
          youtube: this.editUser.youtube
        }
      };
    }
    let obs;
    // Si CV pour étudiant, on utilise FormData
    if (this.role === 'etudiant' && this.editUser.cvFile) {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });
      formData.append('cv', this.editUser.cvFile, this.editUser.cvFile.name);
      obs = this.http.post<any>(`${environment.apiUrl}/profil-etudiant/${this.user.profilEtudiant?.id_etudiant}`, formData);
    } else if (this.role === 'etudiant') {
      obs = this.http.put<any>(`${environment.apiUrl}/profil-etudiant/${this.user.profilEtudiant?.id_etudiant}`, data);
    } else if (this.role === 'tuteur') {
      obs = this.http.put<any>(`${environment.apiUrl}/profil-tuteur/${this.user.profilTuteur?.id_tuteur}`, data);
    } else if (this.role === 'entreprise') {
      obs = this.http.put<any>(`${environment.apiUrl}/entreprise/${this.user.entreprise?.id_entreprise}`, data);
    } else {
      obs = this.utilisateursService.updateUtilisateur(this.user.id_utilisateur, data);
    }
    obs.subscribe({
      next: (response: any) => {
        this.adminSuccess = 'Profil mis à jour avec succès';
        const updatedUser = { ...this.user, ...(response.data || {}), ...response };
        this.user = updatedUser;
        this.authService.setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.closeEditModal();
        setTimeout(() => window.location.reload(), 500);
      },
      error: (err: any) => {
        this.adminError = err.error?.message || 'Une erreur est survenue lors de la mise à jour du profil';
        if (err.error?.errors) {
          const errorMessages = [];
          for (const [field, messages] of Object.entries(err.error.errors)) {
            errorMessages.push(`${field}: ${(messages as string[]).join(', ')}`);
          }
          this.adminError = errorMessages.join('\n');
        }
      }
    });
  }
} 