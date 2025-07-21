import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { UtilisateursService } from '../../modules/utilisateurs/services/utilisateurs.services';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  user: any = null;
  role: string = '';
  adminSuccess: string | null = null;
  adminError: string | null = null;
  showEditModal: boolean = false;
  editUser: any = {};
  editPhotoPreview: string | null = null;
  tofUrl = 'http://localhost:8000/storage/';

  constructor(
    private authService: AuthService, 
    private utilisateursService: UtilisateursService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.role = this.detectRole(this.user);
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

    // Validation des champs
    if (!this.isValidEmail(this.editUser.email)) {
      this.adminError = 'Veuillez entrer une adresse email valide';
      return;
    }

    if (this.editUser.telephone && !this.isValidPhone(this.editUser.telephone)) {
      this.adminError = 'Le numéro de téléphone ne doit contenir que des chiffres et des espaces';
      return;
    }
    
    // Prépare le formData si photo
    let data: any = {
      nom: this.editUser.nom,
      prenom: this.editUser.prenom,
      email: this.editUser.email,
      telephone: this.editUser.telephone
    };

    let obs;
    
    if (this.editUser.photoFile) {
      const formData = new FormData();
      
      // Ajouter la méthode spoofing pour Laravel
      formData.append('_method', 'PUT');
      
      // Ajouter les données du formulaire
      formData.append('nom', this.editUser.nom || '');
      formData.append('prenom', this.editUser.prenom || '');
      formData.append('email', this.editUser.email || '');
      if (this.editUser.telephone) {
        formData.append('telephone', this.editUser.telephone);
      }
      
      // Ajouter le fichier avec le bon nom
      formData.append('photo', this.editUser.photoFile, this.editUser.photoFile.name);
      
      console.log('Envoi du formulaire avec fichier :', {
        hasFile: !!this.editUser.photoFile,
        fileName: this.editUser.photoFile.name,
        formData: Array.from(formData.entries())
      });
      
      // Utiliser la méthode POST avec le FormData qui contient _method=PUT
      obs = this.http.post<any>(`${environment.apiUrl}/utilisateurs/${this.user.id_utilisateur}`, formData);
    } else {
      // Filtrer les champs non définis
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== null && v !== undefined)
      );
      obs = this.utilisateursService.updateUtilisateur(this.user.id_utilisateur, filteredData);
    }

    obs.subscribe({
      next: (response: any) => {
        if (response.success) {
          this.adminSuccess = 'Profil mis à jour avec succès';
          
          // Mettre à jour l'utilisateur avec les nouvelles données
          const updatedUser = { ...this.user, ...response.data };
          // S'assurer que l'URL de la photo est correctement mise à jour
          if (response.data.photo_url) {
            updatedUser.photo = response.data.photo_url;
          } else if (response.data.photo) {
            // Si l'API retourne seulement le chemin relatif
            updatedUser.photo = `http://localhost:8000/storage/${this.user.photo}`;
          }
          
          this.user = updatedUser;
          this.authService.setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.closeEditModal();
          
          // Rafraîchir la page pour s'assurer que tout est à jour
          setTimeout(() => window.location.reload(), 500);
        } else {
          this.adminError = response.message || 'Erreur lors de la mise à jour du profil';
        }
      },
      error: (err: any) => {
        console.error('Erreur lors de la mise à jour du profil:', err);
        this.adminError = err.error?.message || 'Une erreur est survenue lors de la mise à jour du profil';
        
        // Si c'est une erreur de validation, afficher les détails
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