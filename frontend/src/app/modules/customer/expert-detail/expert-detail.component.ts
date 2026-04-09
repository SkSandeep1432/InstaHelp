import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ExpertProfile } from '../../../core/models/user.model';
import { Review } from '../../../core/models/booking.model';

@Component({
  selector: 'app-expert-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">

      <div class="loading-container" *ngIf="loading">
        <div class="spinner-border spinner-border-ih" role="status"></div>
      </div>

      <!-- Not found -->
      <div class="empty-state" *ngIf="!loading && !expert">
        <div class="empty-icon"><i class="bi bi-exclamation-circle"></i></div>
        <h3>Expert not found</h3>
        <a routerLink="/customer/experts" class="btn btn-primary btn-ih-primary fw-semibold">
          <i class="bi bi-arrow-left me-2"></i>Back to Experts
        </a>
      </div>

      <ng-container *ngIf="!loading && expert">

        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mb-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a routerLink="/customer/home" style="color:#6c63ff;">Home</a></li>
            <li class="breadcrumb-item"><a routerLink="/customer/experts" style="color:#6c63ff;">Experts</a></li>
            <li class="breadcrumb-item active">{{ expert.name }}</li>
          </ol>
        </nav>

        <!-- Profile card -->
        <div class="ih-card mb-4">
          <div class="ih-card-body p-4">
            <div class="d-flex gap-4 align-items-start flex-wrap">

              <!-- Avatar -->
              <div class="expert-avatar flex-shrink-0" style="width:96px;height:96px;font-size:2.4rem;">
                {{ expert.name.charAt(0).toUpperCase() }}
              </div>

              <!-- Info -->
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
                  <div>
                    <h2 class="fw-bold mb-1">{{ expert.name }}</h2>
                    <p class="mb-1 fw-semibold" style="color:#6c63ff; font-size:1.1rem;">{{ expert.category }}</p>
                    <div class="d-flex gap-3 flex-wrap text-muted" style="font-size:0.875rem;">
                      <span *ngIf="expert.location">
                        <i class="bi bi-geo-alt-fill me-1"></i>{{ expert.location }}
                      </span>
                      <span>
                        <i class="bi bi-briefcase-fill me-1"></i>{{ expert.experienceYears }} years experience
                      </span>
                      <span *ngIf="expert.averageRating" class="rating-stars fw-semibold">
                        ★ {{ expert.averageRating.toFixed(1) }}
                        <span class="text-muted">({{ expert.totalReviews }} reviews)</span>
                      </span>
                    </div>
                  </div>
                  <button class="btn btn-primary btn-ih-primary fw-semibold px-4 py-2"
                          (click)="bookNow()">
                    <i class="bi bi-calendar2-plus-fill me-2"></i>Book This Expert
                  </button>
                </div>

                <p class="mt-3 mb-2" style="color:#444; line-height:1.7;">{{ expert.description }}</p>

                <div *ngIf="expert.skills" class="d-flex flex-wrap gap-2 mt-2">
                  <span *ngFor="let sk of getSkills(expert.skills)" class="skill-chip" style="font-size:0.82rem; padding:0.3rem 0.8rem;">
                    {{ sk }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews -->
        <div class="ih-card">
          <div class="ih-card-header d-flex align-items-center gap-2">
            <i class="bi bi-star-fill" style="color:#ffc107;"></i>
            Reviews
            <span class="badge ms-1" style="background:#6c63ff;">{{ reviews.length }}</span>
          </div>
          <div class="ih-card-body">

            <div class="loading-container" *ngIf="reviewsLoading" style="min-height:100px;">
              <div class="spinner-border spinner-border-sm spinner-border-ih" role="status"></div>
            </div>

            <div class="empty-state" *ngIf="!reviewsLoading && reviews.length === 0" style="padding:2rem 0;">
              <div class="empty-icon"><i class="bi bi-star"></i></div>
              <p>No reviews yet. Be the first to book this expert!</p>
            </div>

            <div *ngIf="!reviewsLoading && reviews.length > 0" class="d-flex flex-column gap-4">
              <div *ngFor="let review of reviews; let last = last">
                <div class="d-flex gap-3">
                  <div class="flex-shrink-0" style="width:40px;height:40px;border-radius:50%;background:#ede9ff;color:#6c63ff;font-weight:700;display:flex;align-items:center;justify-content:center;">
                    {{ review.customerName.charAt(0).toUpperCase() }}
                  </div>
                  <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center flex-wrap">
                      <strong>{{ review.customerName }}</strong>
                      <small class="text-muted">{{ review.createdAt | date:'MMM d, y' }}</small>
                    </div>
                    <div class="rating-stars mb-1">
                      <span *ngFor="let s of getStars(review.rating)">★</span>
                      <span style="color:#ddd;" *ngFor="let s of getEmptyStars(review.rating)">★</span>
                    </div>
                    <p class="mb-0" style="color:#444; font-size:0.9rem;">{{ review.comment }}</p>
                  </div>
                </div>
                <hr *ngIf="!last" class="my-3">
              </div>
            </div>

          </div>
        </div>

      </ng-container>
    </div>
  `
})
export class ExpertDetailComponent implements OnInit {
  expert: ExpertProfile | null = null;
  reviews: Review[] = [];
  loading = true;
  reviewsLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.get<ExpertProfile>(`/customer/experts/${+id}`).subscribe({
        next: (e) => { this.expert = e; this.loading = false; },
        error: ()  => { this.loading = false; }
      });
      this.apiService.get<Review[]>(`/customer/experts/${+id}/reviews`).subscribe({
        next: (r) => { this.reviews = r; this.reviewsLoading = false; },
        error: ()  => { this.reviewsLoading = false; }
      });
    }
  }

  bookNow(): void {
    if (!this.authService.isLoggedIn()) { this.router.navigate(['/login']); return; }
    if (!this.authService.isCustomer()) return;
    this.router.navigate(['/customer/book', this.expert?.userId]);
  }

  getSkills(skills: string): string[] {
    return skills.split(',').map(s => s.trim()).filter(Boolean);
  }

  getStars(r: number): number[]      { return Array(r).fill(0); }
  getEmptyStars(r: number): number[] { return Array(5 - r).fill(0); }
}
