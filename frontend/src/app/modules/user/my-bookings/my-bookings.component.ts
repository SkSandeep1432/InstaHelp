import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Booking } from '../../../core/models/booking.model';

@Component({
  selector: 'app-user-my-bookings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">

      <div class="page-header">
        <div>
          <h1><i class="bi bi-calendar2-week me-2" style="color:#6c63ff;"></i>My Bookings</h1>
          <p class="text-muted mb-0">Bookings received as an expert</p>
        </div>
      </div>

      <div class="loading-container" *ngIf="loading">
        <div class="spinner-border spinner-border-ih" role="status"></div>
      </div>

      <div class="success-message" *ngIf="successMessage">
        <i class="bi bi-check-circle-fill me-2"></i>{{ successMessage }}
      </div>
      <div class="error-message" *ngIf="errorMessage">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
      </div>

      <div class="empty-state" *ngIf="!loading && bookings.length === 0">
        <div class="empty-icon"><i class="bi bi-inbox"></i></div>
        <h3>No bookings yet</h3>
        <p>When customers book your services, they will appear here.</p>
      </div>

      <div class="d-flex flex-column gap-3" *ngIf="!loading && bookings.length > 0">

        <div class="ih-card" *ngFor="let booking of bookings"
             [style.border-left]="booking.status === 'PENDING' ? '4px solid #ffc107' : booking.status === 'ACCEPTED' ? '4px solid #198754' : '4px solid #e9ecef'">

          <div class="ih-card-body">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">

              <!-- Left: customer info + details -->
              <div class="flex-grow-1">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <div class="expert-avatar" style="width:40px;height:40px;font-size:1rem;flex-shrink:0;">
                    {{ booking.customerName.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="fw-semibold">{{ booking.customerName }}</div>
                    <small class="text-muted">{{ booking.customerEmail }}</small>
                  </div>
                </div>
                <p class="mb-2" style="color:#444; font-size:0.9rem;">{{ booking.requirementNote }}</p>
                <div class="d-flex gap-3 flex-wrap" style="font-size:0.8rem; color:#6c757d;">
                  <span>
                    <i class="bi bi-calendar-event me-1"></i>
                    Created: {{ booking.createdAt | date:'MMM d, y' }}
                  </span>
                  <span *ngIf="booking.scheduledDate">
                    <i class="bi bi-clock me-1"></i>
                    Scheduled: {{ booking.scheduledDate | date:'MMM d, y' }}
                  </span>
                </div>
              </div>

              <!-- Right: status + actions -->
              <div class="d-flex flex-column align-items-end gap-2">
                <span [class]="'status-badge ' + booking.status.toLowerCase()">{{ booking.status }}</span>

                <div class="d-flex gap-2" *ngIf="booking.status === 'PENDING'">
                  <button class="btn btn-sm btn-success fw-semibold"
                          (click)="updateStatus(booking.id, 'ACCEPTED')"
                          [disabled]="updatingId === booking.id">
                    <span *ngIf="updatingId === booking.id" class="spinner-border spinner-border-sm me-1"></span>
                    <i *ngIf="updatingId !== booking.id" class="bi bi-check-lg me-1"></i>Accept
                  </button>
                  <button class="btn btn-sm btn-outline-danger fw-semibold"
                          (click)="updateStatus(booking.id, 'DECLINED')"
                          [disabled]="updatingId === booking.id">
                    <i class="bi bi-x-lg me-1"></i>Decline
                  </button>
                </div>

                <button class="btn btn-sm btn-primary fw-semibold"
                        *ngIf="booking.status === 'ACCEPTED'"
                        (click)="updateStatus(booking.id, 'COMPLETED')"
                        [disabled]="updatingId === booking.id">
                  <span *ngIf="updatingId === booking.id" class="spinner-border spinner-border-sm me-1"></span>
                  <i *ngIf="updatingId !== booking.id" class="bi bi-check2-all me-1"></i>Mark Complete
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class UserMyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  updatingId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.get<Booking[]>('/user/bookings').subscribe({
      next: (data) => { this.bookings = data; this.loading = false; },
      error: ()     => { this.loading = false; }
    });
  }

  updateStatus(id: number, status: string): void {
    this.updatingId = id;
    this.clear();
    const actionMap: Record<string, string> = { ACCEPTED: 'accept', DECLINED: 'decline', COMPLETED: 'complete' };
    const action = actionMap[status] || status.toLowerCase();
    this.apiService.put<Booking>(`/user/bookings/${id}/${action}`, {}).subscribe({
      next: (updated) => {
        const idx = this.bookings.findIndex(b => b.id === id);
        if (idx !== -1) this.bookings[idx] = updated;
        this.successMessage = `Booking ${action} successfully.`;
        this.updatingId = null;
      },
      error: () => { this.errorMessage = 'Failed to update booking.'; this.updatingId = null; }
    });
  }

  clear(): void { this.successMessage = ''; this.errorMessage = ''; }
}
