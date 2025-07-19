import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Nécessaire pour *ngFor, *ngIf etc.
import { HttpClient } from '@angular/common/http'; // On importe HttpClient plutôt que le module
import { UtilisateursService } from './services/utilisateurs.services';
import { Utilisateur, Role } from './modeles/utilisateurs.model';
import { catchError } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.css']
})
export class UtilisateursComponent implements OnInit {
  utilisateurs: Utilisateur[] = [];
  filteredUtilisateurs: Utilisateur[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  error: string | null = null;
  success: string | null = null;

  // Pagination
  page: number = 1;
  pageSize: number = 10;

  // Modale
  showModal: boolean = false;
  isEditMode: boolean = false;
  utilisateurForm: Partial<Utilisateur> = {};
  editingId: number | null = null;

  // Pour la gestion des rôles
  allRoles: Role[] = [];
  showRoleModal: boolean = false;
  roleModalUser: Utilisateur | null = null;
  selectedRoleId: number | null = null;
  roleFilter: number | null = null;

  constructor(private utilisateursService: UtilisateursService) { }

  ngOnInit() {
    this.loadUtilisateurs();
    this.loadAllRoles();
  }

  loadUtilisateurs() {
    this.loading = true;
    this.utilisateursService.getAllUtilisateurs().subscribe({
      next: (data) => {
        this.utilisateurs = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
      }
    });
  }

  loadAllRoles() {
    this.utilisateursService.getAllRoles().subscribe({
      next: (roles) => {
        this.allRoles = roles;
      },
      error: () => {
        this.allRoles = [];
      }
    });
  }

  // Gestion des rôles utilisateur
  openRoleModal(utilisateur: Utilisateur) {
    this.roleModalUser = utilisateur;
    this.showRoleModal = true;
    this.selectedRoleId = null;
  }
  closeRoleModal() {
    this.roleModalUser = null;
    this.showRoleModal = false;
    this.selectedRoleId = null;
  }
  addRoleToUser() {
    if (!this.roleModalUser || !this.selectedRoleId) return;
    this.utilisateursService.addRoleToUser(this.roleModalUser.id_utilisateur, this.selectedRoleId).subscribe({
      next: (user) => {
        this.roleModalUser!.roles = user.roles;
        this.loadUtilisateurs();
        this.selectedRoleId = null;
      }
    });
  }
  removeRoleFromUser(roleId: number) {
    if (!this.roleModalUser) return;
    this.utilisateursService.removeRoleFromUser(this.roleModalUser.id_utilisateur, roleId).subscribe({
      next: (user) => {
        this.roleModalUser!.roles = user.roles;
        this.loadUtilisateurs();
      }
    });
  }

  // Filtrage par rôle
  applyFilter() {
    let filtered = this.utilisateurs;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.nom?.toLowerCase().includes(term) ||
        u.prenom?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
      );
    }
    if (this.roleFilter) {
      filtered = filtered.filter(u => u.roles && u.roles.some(r => r.id_role === this.roleFilter));
    }
    this.filteredUtilisateurs = [...filtered];
    this.page = 1;
  }

  // Pagination helpers
  get paginatedUtilisateurs() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredUtilisateurs.slice(start, start + this.pageSize);
  }
  get totalPages() {
    return Math.ceil(this.filteredUtilisateurs.length / this.pageSize);
  }

  getRolesString(utilisateur: Utilisateur): string {
    return utilisateur.roles && utilisateur.roles.length > 0
      ? utilisateur.roles.map(r => r.nom_role).join(', ')
      : 'Aucun';
  }

  hasUserRole(roleId: number): boolean {
    return !!this.roleModalUser?.roles && this.roleModalUser.roles.some(r => r.id_role === roleId);
  }

  hasNoRoles(): boolean {
    return !this.roleModalUser || !Array.isArray(this.roleModalUser.roles) || this.roleModalUser.roles.length === 0;
  }

  // CRUD
  openCreateModal() {
    this.isEditMode = false;
    this.utilisateurForm = {};
    this.showModal = true;
    this.editingId = null;
    this.error = null;
    this.success = null;
  }
  openEditModal(utilisateur: Utilisateur) {
    this.isEditMode = true;
    this.utilisateurForm = { ...utilisateur };
    this.showModal = true;
    this.editingId = utilisateur.id_utilisateur;
    this.error = null;
    this.success = null;
  }
  closeModal() {
    this.showModal = false;
    this.utilisateurForm = {};
    this.editingId = null;
  }
  submitForm() {
    if (this.isEditMode && this.editingId) {
      this.updateUtilisateur();
    } else {
      this.createUtilisateur();
    }
  }
  createUtilisateur() {
    this.loading = true;
    this.utilisateursService.createUtilisateur(this.utilisateurForm).subscribe({
      next: (u) => {
        this.success = 'Utilisateur créé avec succès';
        this.loadUtilisateurs();
        this.closeModal();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la création';
        this.loading = false;
      }
    });
  }
  updateUtilisateur() {
    if (!this.editingId) return;
    this.loading = true;
    this.utilisateursService.updateUtilisateur(this.editingId, this.utilisateurForm).subscribe({
      next: (u) => {
        this.success = 'Utilisateur modifié avec succès';
        this.loadUtilisateurs();
        this.closeModal();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la modification';
        this.loading = false;
      }
    });
  }
  deleteUtilisateur(id: number) {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    this.loading = true;
    this.utilisateursService.deleteUtilisateur(id).subscribe({
      next: () => {
        this.success = 'Utilisateur supprimé';
        this.loadUtilisateurs();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la suppression';
        this.loading = false;
      }
    });
  }
}