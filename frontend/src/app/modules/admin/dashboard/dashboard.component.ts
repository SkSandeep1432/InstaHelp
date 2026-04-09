import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardStats } from '../../../core/models/booking.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1><i class="bi bi-grid-1x2-fill me-2" style="color:#6c63ff;"></i>Admin Dashboard</h1>
          <p class="text-muted mb-0">Welcome back, <strong>{{ adminName }}</strong></p>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading-container" *ngIf="loading">
        <div class="spinner-border spinner-border-ih" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <ng-container *ngIf="!loading">

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalExperts || 0 }}</div>
            <div class="stat-label"><i class="bi bi-people-fill me-1"></i>Total Experts</div>
          </div>
          <div class="stat-card orange">
            <div class="stat-number">{{ stats.pendingApprovals || 0 }}</div>
            <div class="stat-label"><i class="bi bi-hourglass-split me-1"></i>Pending Approvals</div>
          </div>
          <div class="stat-card green">
            <div class="stat-number">{{ stats.totalCustomers || 0 }}</div>
            <div class="stat-label"><i class="bi bi-person-fill me-1"></i>Total Customers</div>
          </div>
          <div class="stat-card blue">
            <div class="stat-number">{{ stats.totalBookings || 0 }}</div>
            <div class="stat-label"><i class="bi bi-calendar2-check me-1"></i>Total Bookings</div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="row g-4">

          <div class="col-md-4">
            <div class="ih-card h-100">
              <div class="ih-card-body d-flex align-items-center gap-3">
                <div class="rounded-3 p-3" style="background:#fff3cd;">
                  <i class="bi bi-person-check-fill" style="font-size:2rem; color:#f5a623;"></i>
                </div>
                <div class="flex-grow-1">
                  <h6 class="fw-bold mb-1">Expert Approvals</h6>
                  <p class="text-muted small mb-2">Review pending registrations</p>
                  <a routerLink="/admin/user-approvals" class="btn btn-sm btn-warning fw-semibold">
                    Review Now
                    <span class="badge bg-dark ms-1" *ngIf="stats.pendingApprovals">{{ stats.pendingApprovals }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="ih-card h-100">
              <div class="ih-card-body d-flex align-items-center gap-3">
                <div class="rounded-3 p-3" style="background:#cfe2ff;">
                  <i class="bi bi-calendar2-check" style="font-size:2rem; color:#0d6efd;"></i>
                </div>
                <div class="flex-grow-1">
                  <h6 class="fw-bold mb-1">All Bookings</h6>
                  <p class="text-muted small mb-2">Monitor platform bookings</p>
                  <a routerLink="/admin/bookings" class="btn btn-sm btn-primary fw-semibold">View Bookings</a>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="ih-card h-100">
              <div class="ih-card-body d-flex align-items-center gap-3">
                <div class="rounded-3 p-3" style="background:#d1e7dd;">
                  <i class="bi bi-tags-fill" style="font-size:2rem; color:#198754;"></i>
                </div>
                <div class="flex-grow-1">
                  <h6 class="fw-bold mb-1">Categories</h6>
                  <p class="text-muted small mb-2">Manage service categories</p>
                  <a routerLink="/admin/categories" class="btn btn-sm btn-success fw-semibold">Manage</a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </ng-container>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {};
  loading = true;
  adminName = '';

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    this.adminName = this.authService.getName() || 'Admin';
    this.apiService.get<DashboardStats>('/admin/dashboard/stats').subscribe({
      next: (data) => { this.stats = data; this.loading = false; },
      error: ()     => { this.loading = false; }
    });
  }
}
