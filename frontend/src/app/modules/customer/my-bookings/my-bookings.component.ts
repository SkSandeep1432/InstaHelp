import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Booking, DashboardStats } from '../../../core/models/booking.model';

@Component({
  selector: 'app-customer-my-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-container">

      <div class="page-header">
        <div>
          <h1><i class="bi bi-calendar2-check me-2" style="color:#6c63ff;"></i>My Bookings</h1>
          <p class="text-muted mb-0">Track and manage your service requests</p>
        </div>
        <a routerLink="/customer/experts" class="btn btn-primary btn-ih-primary fw-semibold">
          <i class="bi bi-plus-lg me-2"></i>Book Another Expert
        </a>
      </div>

      <!-- Stats -->
      <div class="stats-grid" *ngIf="!loading && bookings.length > 0">
        <div class="stat-card">
          <div class="stat-number">{{ stats.totalBookings || bookings.length }}</div>
          <div class="stat-label"><i class="bi bi-calendar2 me-1"></i>Total</div>
        </div>
        <div class="stat-card orange">
          <div class="stat-number">{{ stats.pendingBookings || countByStatus('PENDING') }}</div>
          <div class="stat-label"><i class="bi bi-hourglass-split me-1"></i>Pending</div>
        </div>
        <div class="stat-card blue">
          <div class="stat-number">{{ countByStatus('ACCEPTED') }}</div>
          <div class="stat-label"><i class="bi bi-calendar2-check me-1"></i>Accepted</div>
        </div>
        <div class="stat-card green">
          <div class="stat-number">{{ stats.completedBookings || countByStatus('COMPLETED') }}</div>
          <div class="stat-label"><i class="bi bi-check2-all me-1"></i>Completed</div>
        </div>
      </div>

      <!-- Alerts -->
      <div class="loading-container" *ngIf="loading">
        <div class="spinner-border spinner-border-ih" role="status"></div>
      </div>
      <div class="success-message" *ngIf="successMessage">
        <i class="bi bi-check-circle-fill me-2"></i>{{ successMessage }}
      </div>
      <div class="error-message" *ngIf="errorMessage">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
      </div>

      <!-- Empty -->
      <div class="empty-state" *ngIf="!loading && bookings.length === 0">
        <div class="empty-icon"><i class="bi bi-inbox"></i></div>
        <h3>No bookings yet</h3>
        <p>Browse experts and book a service to get started.</p>
        <a routerLink="/customer/experts" class="btn btn-primary btn-ih-primary fw-semibold mt-2">
          Find Experts
        </a>
      </div>

      <!-- Booking cards -->
      <div class="d-flex flex-column gap-3" *ngIf="!loading && bookings.length > 0">

        <div class="ih-card" *ngFor="let booking of bookings"
             [style.border-left]="getBorderColor(booking.status)">
          <div class="ih-card-body">

            <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">

              <!-- Left -->
              <div class="flex-grow-1">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <div style="width:38px;height:38px;border-radius:50%;background:#6c63ff;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;">
                    {{ booking.expertName.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="fw-semibold">{{ booking.expertName }}</div>
                    <small class="text-muted">{{ booking.expertEmail }}</small>
                  </div>
                </div>
                <p class="mb-2" style="color:#444; font-size:0.9rem;">{{ booking.requirementNote }}</p>
                <div class="d-flex gap-3 flex-wrap" style="font-size:0.78rem; color:#6c757d;">
                  <span>
                    <i class="bi bi-calendar-event me-1"></i>
                    Booked {{ booking.createdAt | date:'MMM d, y' }}
                  </span>
                  <span *ngIf="booking.scheduledDate">
                    <i class="bi bi-clock me-1"></i>
                    Scheduled {{ booking.scheduledDate | date:'MMM d, y' }}
                  </span>
                </div>
              </div>

              <!-- Right -->
              <div class="d-flex flex-column align-items-end gap-2">
                <span [class]="'status-badge ' + booking.status.toLowerCase()">{{ booking.status }}</span>

                <button class="btn btn-sm btn-outline-primary fw-semibold"
                        *ngIf="booking.status === 'COMPLETED' && !hasReview(booking.id)"
                        (click)="openReviewForm(booking.id)">
                  <i class="bi bi-star-fill me-1"></i>Leave Review
                </button>
                <span *ngIf="hasReview(booking.id)" class="text-muted" style="font-size:0.8rem;">
                  <i class="bi bi-star-fill me-1" style="color:#ffc107;"></i>Review submitted
                </span>
              </div>
            </div>

            <!-- Inline review form -->
            <div class="mt-3 pt-3 border-top" *ngIf="reviewingId === booking.id">
              <h6 class="fw-bold mb-3"><i class="bi bi-star-fill me-2" style="color:#ffc107;"></i>Write a Review</h6>
              <form [formGroup]="reviewForm" (ngSubmit)="submitReview()">

                <!-- Star rating -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">Rating <span class="text-danger">*</span></label>
                  <div class="d-flex gap-1">
                    <button type="button" *ngFor="let star of [1,2,3,4,5]"
                            class="btn btn-sm p-1 border-0"
                            (click)="setRating(star)"
                            [style.color]="star <= (reviewForm.get('rating')?.value || 0) ? '#ffc107' : '#dee2e6'"
                            style="font-size:1.6rem; line-height:1; background:none;">
                      ★
                    </button>
                    <span class="ms-2 align-self-center text-muted small">
                      {{ getRatingLabel(reviewForm.get('rating')?.value) }}
                    </span>
                  </div>
                  <div class="text-danger small" *ngIf="reviewForm.get('rating')?.value < 1 && reviewSubmitted">
                    Please select a rating.
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">Your Review <small class="text-muted">(optional)</small></label>
                  <textarea class="form-control" formControlName="comment" rows="3"
                            placeholder="Share your experience with this expert..."></textarea>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary btn-ih-primary fw-semibold"
                          [disabled]="submittingReview">
                    <span *ngIf="submittingReview" class="spinner-border spinner-border-sm me-1"></span>
                    <i *ngIf="!submittingReview" class="bi bi-send-fill me-1"></i>
                    {{ submittingReview ? 'Submitting...' : 'Submit Review' }}
                  </button>
                  <button type="button" class="btn btn-outline-secondary" (click)="cancelReview()">Cancel</button>
                </div>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  `
})
export class CustomerMyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  stats: DashboardStats = {};
  loading = true;
  reviewingId: number | null = null;
  reviewSubmitted = false;
  submittingReview = false;
  reviewedIds = new Set<number>();
  reviewForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      rating:  [0, [Validators.required, Validators.min(1)]],
      comment: ['']
    });
  }

  ngOnInit(): void {
    this.apiService.get<Booking[]>('/customer/bookings').subscribe({
      next: (data) => { this.bookings = data; this.loading = false; },
      error: ()     => { this.loading = false; }
    });
    this.apiService.get<DashboardStats>('/customer/dashboard/stats').subscribe({
      next: (d) => this.stats = d,
      error: ()  => {}
    });
  }

  countByStatus(status: string): number {
    return this.bookings.filter(b => b.status === status).length;
  }

  getBorderColor(status: string): string {
    const map: Record<string, string> = {
      PENDING: '4px solid #ffc107',
      ACCEPTED: '4px solid #198754',
      DECLINED: '4px solid #dc3545',
      COMPLETED: '4px solid #6c757d'
    };
    return map[status] || '4px solid #e9ecef';
  }

  openReviewForm(id: number): void {
    this.reviewingId = id;
    this.reviewSubmitted = false;
    this.reviewForm.reset({ rating: 0, comment: '' });
  }

  cancelReview(): void { this.reviewingId = null; this.reviewForm.reset(); }

  setRating(r: number): void { this.reviewForm.patchValue({ rating: r }); }

  getRatingLabel(r: number): string {
    return ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][r] || '';
  }

  submitReview(): void {
    this.reviewSubmitted = true;
    if (!this.reviewingId || this.reviewForm.get('rating')?.value < 1) return;

    this.submittingReview = true;
    const payload = {
      bookingId: this.reviewingId,
      rating:    this.reviewForm.value.rating,
      comment:   this.reviewForm.value.comment
    };

    this.apiService.post('/customer/reviews', payload).subscribe({
      next: () => {
        this.reviewedIds.add(this.reviewingId!);
        this.reviewingId = null;
        this.reviewForm.reset();
        this.successMessage = 'Review submitted! Thank you for your feedback.';
        this.submittingReview = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to submit review.';
        this.submittingReview = false;
      }
    });
  }

  hasReview(id: number): boolean { return this.reviewedIds.has(id); }

  clear(): void { this.successMessage = ''; this.errorMessage = ''; }
}
