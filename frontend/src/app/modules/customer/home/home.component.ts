import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ExpertProfile } from '../../../core/models/user.model';
import { Category } from '../../../core/models/booking.model';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `

    <!-- Hero -->
    <div class="hero-section">
      <h1>Find the Perfect Expert<br>for Your Needs</h1>
      <p>Connect with skilled professionals across dozens of categories.<br>
         Browse, book, and get things done — fast.</p>

      <div class="mx-auto" style="max-width:560px;">
        <div class="input-group input-group-lg shadow-sm">
          <span class="input-group-text bg-white border-end-0">
            <i class="bi bi-search text-muted"></i>
          </span>
          <input type="text" class="form-control border-start-0 ps-0"
                 [(ngModel)]="searchTerm" (ngModelChange)="filterExperts()"
                 placeholder="Search by name, skill, or category...">
        </div>
      </div>

      <div *ngIf="!isLoggedIn()" class="mt-4 d-flex gap-3 justify-content-center flex-wrap">
        <a routerLink="/login"
           class="btn btn-light btn-lg fw-semibold px-4" style="color:#6c63ff;">
          <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
        </a>
        <a routerLink="/register"
           class="btn btn-outline-light btn-lg fw-semibold px-4">
          <i class="bi bi-person-plus-fill me-2"></i>Register Free
        </a>
      </div>
    </div>

    <div class="page-container">

      <!-- Category filter pills -->
      <div *ngIf="categories.length > 0" class="mb-4">
        <p class="text-muted small fw-semibold text-uppercase mb-2" style="letter-spacing:0.5px;">
          <i class="bi bi-funnel-fill me-1"></i>Filter by Category
        </p>
        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-sm rounded-pill fw-semibold"
                  [ngClass]="selectedCategory === '' ? 'btn-primary' : 'btn-outline-secondary'"
                  (click)="filterByCategory('')">
            All
          </button>
          <button *ngFor="let cat of categories"
                  class="btn btn-sm rounded-pill fw-semibold"
                  [ngClass]="selectedCategory === cat.name ? 'btn-primary' : 'btn-outline-secondary'"
                  (click)="filterByCategory(cat.name)">
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading-container" *ngIf="loading">
        <div class="spinner-border spinner-border-ih" role="status"></div>
      </div>

      <!-- Results header -->
      <div *ngIf="!loading" class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0">
          {{ filteredExperts.length }} Expert{{ filteredExperts.length !== 1 ? 's' : '' }} Available
        </h5>
        <a routerLink="/customer/experts" class="btn btn-sm btn-outline-primary fw-semibold">
          <i class="bi bi-grid-fill me-1"></i>Browse All
        </a>
      </div>

      <!-- Empty search result -->
      <div class="empty-state" *ngIf="!loading && filteredExperts.length === 0">
        <div class="empty-icon"><i class="bi bi-search"></i></div>
        <h3>No experts found</h3>
        <p>Try a different search term or category.</p>
      </div>

      <!-- Expert grid -->
      <div class="row g-4" *ngIf="!loading && filteredExperts.length > 0">
        <div class="col-md-6 col-lg-4" *ngFor="let expert of filteredExperts">
          <div class="ih-card expert-card h-100" [routerLink]="['/customer/experts', expert.userId]">
            <div class="ih-card-body d-flex flex-column">

              <!-- Header row -->
              <div class="d-flex gap-3 align-items-start mb-3">
                <div class="expert-avatar">{{ expert.name.charAt(0).toUpperCase() }}</div>
                <div class="flex-grow-1 overflow-hidden">
                  <h6 class="fw-bold mb-0 text-truncate">{{ expert.name }}</h6>
                  <small style="color:#6c63ff; font-weight:600;">{{ expert.category }}</small>
                  <div class="text-muted mt-1" style="font-size:0.78rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    {{ expert.description || 'No description provided' }}
                  </div>
                </div>
              </div>

              <!-- Meta row -->
              <div class="d-flex gap-2 flex-wrap mb-2" style="font-size:0.78rem; color:#6c757d;">
                <span *ngIf="expert.location">
                  <i class="bi bi-geo-alt-fill me-1"></i>{{ expert.location }}
                </span>
                <span>
                  <i class="bi bi-briefcase-fill me-1"></i>{{ expert.experienceYears }}yr exp
                </span>
                <span *ngIf="expert.averageRating" class="rating-stars fw-semibold">
                  ★ {{ expert.averageRating.toFixed(1) }}
                  <span class="text-muted">({{ expert.totalReviews }})</span>
                </span>
              </div>

              <!-- Skills -->
              <div *ngIf="expert.skills" class="d-flex flex-wrap gap-1 mb-3">
                <span *ngFor="let sk of getTopSkills(expert.skills)" class="skill-chip">{{ sk }}</span>
              </div>

              <!-- Book button -->
              <div class="mt-auto">
                <button class="btn btn-primary btn-ih-primary w-100 fw-semibold"
                        (click)="bookExpert($event, expert.userId)">
                  <i class="bi bi-calendar2-plus-fill me-2"></i>Book Now
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class CustomerHomeComponent implements OnInit {
  allExperts: ExpertProfile[] = [];
  filteredExperts: ExpertProfile[] = [];
  categories: Category[] = [];
  selectedCategory = '';
  searchTerm = '';
  loading = true;

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    this.apiService.get<ExpertProfile[]>('/customer/experts').subscribe({
      next: (data) => {
        this.allExperts = data;
        this.filteredExperts = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
    this.apiService.get<Category[]>('/public/categories').subscribe({
      next: (cats) => this.categories = cats,
      error: ()     => this.categories = []
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
        (e.skills || '').toLowerCase().includes(t) ||
        (e.description || '').toLowerCase().includes(t)
      );
    }
    this.filteredExperts = result;
  }

  filterByCategory(cat: string): void {
    this.selectedCategory = cat;
    this.filterExperts();
  }

  getTopSkills(skills: string): string[] {
    return skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3);
  }

  isLoggedIn(): boolean { return this.authService.isLoggedIn(); }

  bookExpert(event: Event, expertId: number): void {
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      window.location.href = '/login';
      return;
    }
    if (!this.authService.isCustomer()) {
      window.location.href = `/customer/experts/${expertId}`;
      return;
    }
    window.location.href = `/customer/book/${expertId}`;
  }
}
