import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ExpertProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-expert-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1><i class="bi bi-people-fill me-2" style="color:#6c63ff;"></i>Browse Experts</h1>
          <p class="text-muted mb-0">{{ filteredExperts.length }} expert(s) available</p>
        </div>
        <div class="d-flex gap-2 flex-wrap align-items-center">
          <!-- Category filter -->
          <select class="form-select form-select-sm" style="width:180px;"
                  [(ngModel)]="selectedCategory" (ngModelChange)="filterExperts()">
            <option value="">All Categories</option>
            <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
          </select>
          <!-- Search -->
          <div class="input-group input-group-sm" style="width:220px;">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control"
                   [(ngModel)]="searchTerm" (ngModelChange)="filterExperts()"
                   placeholder="Search experts...">
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading-container" *ngIf="loading">
        <div class="spinner-border spinner-border-ih" role="status"></div>
      </div>

      <!-- Empty -->
      <div class="empty-state" *ngIf="!loading && filteredExperts.length === 0">
        <div class="empty-icon"><i class="bi bi-search"></i></div>
        <h3>No experts found</h3>
        <p>Try adjusting your search or category filter.</p>
      </div>

      <!-- Grid -->
      <div class="row g-4" *ngIf="!loading && filteredExperts.length > 0">
        <div class="col-md-6 col-lg-4" *ngFor="let expert of filteredExperts">
          <div class="ih-card expert-card h-100">
            <div class="ih-card-body d-flex flex-column">

              <div class="d-flex gap-3 align-items-start mb-3">
                <div class="expert-avatar" style="width:60px;height:60px;font-size:1.4rem;flex-shrink:0;">
                  {{ expert.name.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-grow-1 overflow-hidden">
                  <h6 class="fw-bold mb-0">{{ expert.name }}</h6>
                  <small style="color:#6c63ff; font-weight:600;">{{ expert.category }}</small>
                  <p class="text-muted mb-0 mt-1" style="font-size:0.8rem;">
                    {{ expert.description | slice:0:100 }}{{ (expert.description?.length ?? 0) > 100 ? '...' : '' }}
                  </p>
                </div>
              </div>

              <div class="d-flex flex-wrap gap-2 mb-2" style="font-size:0.78rem; color:#6c757d;">
                <span *ngIf="expert.location">
                  <i class="bi bi-geo-alt-fill me-1"></i>{{ expert.location }}
                </span>
                <span>
                  <i class="bi bi-briefcase-fill me-1"></i>{{ expert.experienceYears }} yrs
                </span>
                <span *ngIf="expert.averageRating" class="rating-stars fw-semibold">
                  ★ {{ expert.averageRating.toFixed(1) }}
                </span>
              </div>

              <div *ngIf="expert.skills" class="d-flex flex-wrap gap-1 mb-3">
                <span *ngFor="let sk of getSkills(expert.skills)" class="skill-chip">{{ sk }}</span>
              </div>

              <div class="mt-auto d-flex gap-2">
                <a [routerLink]="['/customer/experts', expert.userId]"
                   class="btn btn-sm btn-outline-primary fw-semibold flex-grow-1">
                  <i class="bi bi-eye-fill me-1"></i>View Profile
                </a>
                <a [routerLink]="['/customer/book', expert.userId]"
                   class="btn btn-sm btn-primary btn-ih-primary fw-semibold flex-grow-1">
                  <i class="bi bi-calendar2-plus-fill me-1"></i>Book Now
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class ExpertListComponent implements OnInit {
  allExperts: ExpertProfile[] = [];
  filteredExperts: ExpertProfile[] = [];
  categories: string[] = [];
  selectedCategory = '';
  searchTerm = '';
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.get<ExpertProfile[]>('/customer/experts').subscribe({
      next: (data) => {
        this.allExperts = data;
        this.filteredExperts = data;
        this.categories = [...new Set(data.map(e => e.category).filter(Boolean))];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  filterExperts(): void {
    let result = this.allExperts;
    if (this.selectedCategory) {
      result = result.filter(e => e.category === this.selectedCategory);
    }
    if (this.searchTerm) {
      const t = this.searchTerm.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(t) ||
        (e.category || '').toLowerCase().includes(t) ||
        (e.skills || '').toLowerCase().includes(t)
      );
    }
    this.filteredExperts = result;
  }

  getSkills(skills: string): string[] {
    return skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4);
  }
}
