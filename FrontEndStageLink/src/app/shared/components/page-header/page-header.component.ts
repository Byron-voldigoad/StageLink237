import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterConfig {
  type: 'search' | 'select' | 'date' | 'toggle';
  key: string;
  label: string;
  options?: { value: string; label: string }[];
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white shadow">
      <div class="container mx-auto px-4">
        <div class="py-4">
          <!-- Titre de la page -->
          <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>

          <!-- Barre de filtres -->
          <div *ngIf="showFilters" class="mt-4 flex flex-wrap items-center gap-4">
            <!-- Barre de recherche -->
            <div class="flex-1 min-w-[200px]">
              <div class="relative">
                <input
                  type="text"
                  [placeholder]="'Rechercher ' + title.toLowerCase() + '...'"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  (input)="onSearchChange($event)"
                >
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Filtres supplémentaires -->
            <div *ngFor="let filter of filters" class="flex items-center space-x-2">
              <!-- Select Filter -->
              <div *ngIf="filter.type === 'select'" class="min-w-[150px]">
                <label [for]="filter.key" class="block text-sm font-medium text-gray-700">{{ filter.label }}</label>
                <select
                  [id]="filter.key"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  (change)="onFilterChange(filter.key, $event)"
                >
                  <option value="">Tous</option>
                  <option *ngFor="let option of filter.options" [value]="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <!-- Date Filter -->
              <div *ngIf="filter.type === 'date'" class="min-w-[150px]">
                <label [for]="filter.key" class="block text-sm font-medium text-gray-700">{{ filter.label }}</label>
                <input
                  type="date"
                  [id]="filter.key"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  (change)="onFilterChange(filter.key, $event)"
                >
              </div>

              <!-- Toggle Filter -->
              <div *ngIf="filter.type === 'toggle'" class="flex items-center">
                <label [for]="filter.key" class="mr-3 text-sm font-medium text-gray-700">{{ filter.label }}</label>
                <button
                  type="button"
                  [id]="filter.key"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  [class.bg-red-600]="toggleStates[filter.key]"
                  [class.bg-gray-200]="!toggleStates[filter.key]"
                  (click)="onToggleChange(filter.key)"
                >
                  <span
                    class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    [class.translate-x-5]="toggleStates[filter.key]"
                    [class.translate-x-0]="!toggleStates[filter.key]"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() showFilters: boolean = true;
  @Input() filters: FilterConfig[] = [];
  
  @Output() search = new EventEmitter<string>();
  @Output() filter = new EventEmitter<{key: string, value: any}>();

  toggleStates: { [key: string]: boolean } = {};

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }

  onFilterChange(key: string, event: Event): void {
    const value = (event.target as HTMLSelectElement | HTMLInputElement).value;
    this.filter.emit({ key, value });
  }

  onToggleChange(key: string): void {
    this.toggleStates[key] = !this.toggleStates[key];
    this.filter.emit({ key, value: this.toggleStates[key] });
  }
} 