import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardStats } from '../../../core/models/booking.model';
import { ExpertProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">

      <div class="page-header">
        <div>
          <h1><i class="bi bi-grid-1x2-fill me-2" style="color:#6c63ff;"></i>Expert Dashboard</h1>
          <p class="text-muted mb-0">Welcome back, <strong>{{ expertName }}</strong>!</p>
        </div>
        <a routerLink="/user/profile" class="btn btn-primary btn-ih-primary fw-semibold">
          <i class="bi bi-pencil-fill me-2"></i>Edit Profile
        </a>
      </div>

      <div class="loading-container" *ngIf="loading">
        <div class="spinner-border spinner-border-ih" role="status"></div>
      </div>

      <ng-container *ngIf="!loading">

        <!-- Profile status banner -->
        <div class="alert d-flex align-items-center gap-3 mb-4 rounded-3"
             [ngClass]="{
               'alert-warning':  profile?.status === 'PENDING',
               'alert-success':  profile?.status === 'APPROVED',
               'alert-danger':   profile?.status === 'REJECTED'
             }">
          <i class="fs-4" [ngClass]="{
               'bi bi-hourglass-split': profile?.status === 'PENDING',
               'bi bi-check-circle-fill': profile?.status === 'APPROVED',
               'bi bi-x-circle-fill': profile?.status === 'REJECTED'
             }"></i>
          <div>
            <strong>Profile Status:
              <span class="status-badge ms-1" [class]="'status-badge ' + (profile?.status || '').toLowerCase()">
                {{ profile?.status }}
              </span>
            </strong>
            <div *ngIf="profile?.status === 'PENDING'" class="mt-1 small">
              Your profile is under review by our admin team. You'll be notified once approved.
            </div>
            <div *ngIf="profile?.status === 'APPROVED'" class="mt-1 small">
              Your profile is live! Customers can now find and book your services.
            </div>
            <div *ngIf="profile?.status === 'REJECTED'" class="mt-1 small">
              Your profile was not approved.
              <span *ngIf="profile?.rejectionReason">
                Reason: <em>{{ profile?.rejectionReason }}</em>
              </span>
              Please update your profile and contact support.
            </div>
          </div>
        </div>

        <!-- Stats (only for approved) -->
        <div class="stats-grid" *ngIf="profile?.status === 'APPROVED'">
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalBookings || 0 }}</div>
            <div class="stat-label"><i class="bi bi-calendar2-week me-1"></i>Total Bookings</div>
          </div>
          <div class="stat-card orange">
            <div class="stat-number">{{ stats.pendingBookings || 0 }}</div>
            <div class="stat-label"><i class="bi bi-hourglass-split me-1"></i>Pending</div>
          </div>
          <div class="stat-card blue">
            <div class="stat-number">{{ stats.acceptedBookings || 0 }}</div>
            <div class="stat-label"><i class="bi bi-calendar2-check me-1"></i>Accepted</div>
          </div>
          <div class="stat-card green">
            <div class="stat-number">{{ stats.completedBookings || 0 }}</div>
            <div class="stat-label"><i class="bi bi-check2-all me-1"></i>Completed</div>
          </div>
        </div>

        <!-- Quick links -->
        <div class="row g-4">
          <div class="col-md-6">
            <div class="ih-card h-100">
              <div class="ih-card-body d-flex align-items-center gap-3">
                <div class="rounded-3 p-3" style="background:#cfe2ff;">
                  <i class="bi bi-calendar2-week" style="font-size:2rem; color:#0d6efd;"></i>
                </div>
                <div>
                  <h6 class="fw-bold mb-1">Manage Bookings</h6>
                  <p class="text-muted small mb-2">Accept, decline, or complete your bookings</p>
                  <a routerLink="/user/my-bookings" class="btn btn-sm btn-primary fw-semibold">View Bookings</a>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="ih-card h-100">
              <div class="ih-card-body d-flex align-items-center gap-3">
                <div class="rounded-3 p-3" style="background:#e8d5f5;">
                  <i class="bi bi-person-badge-fill" style="font-size:2rem; color:#9c27b0;"></i>
                </div>
                <div>
                  <h6 class="fw-bold mb-1">Your Profile</h6>
                  <p class="text-muted small mb-2">Update your skills, description & availability</p>
                  <a routerLink="/user/profile" class="btn btn-sm btn-outline-primary fw-semibold">Edit Profile</a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </ng-container>
    </div>
  `
})
export class UserDashboardComponent implements OnInit {
  stats: DashboardStats = {};
  profile: ExpertProfile | null = null;
  loading = true;
  expertName = '';

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    this.expertName = this.authService.getName() || 'Expert';

    this.apiService.get<ExpertProfile>('/user/profile').subscribe({
      next: (p) => { this.profile = p; this.loading = false; },
      error: ()  => { this.loading = false; }
    });

    this.apiService.get<DashboardStats>('/user/dashboard/stats').subscribe({
      next: (d) => this.stats = d,
      error: ()  => {}
    });
  }
}
