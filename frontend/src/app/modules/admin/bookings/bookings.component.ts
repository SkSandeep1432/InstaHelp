import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Booking } from '../../../core/models/booking.model';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <h1><i class="bi bi-calendar2-check me-2" style="color:#6c63ff;"></i>All Bookings</h1>
        <div class="d-flex gap-2 align-items-center flex-wrap">
          <!-- Status filter -->
          <select class="form-select form-select-sm" style="width:160px;" [(ngModel)]="filterStatus" (ngModelChange)="applyFilter()">
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="DECLINED">Declined</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <!-- Search -->
          <div class="input-group input-group-sm" style="width:240px;">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control" [(ngModel)]="searchTerm"
                   (ngModelChange)="applyFilter()" placeholder="Search by name...">
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading-container" *ngIf="loading">
        <div class="spinner-border spinner-border-ih" role="status"></div>
      </div>

      <!-- Table -->
      <div class="ih-card" *ngIf="!loading">
        <div class="ih-card-header d-flex justify-content-between align-items-center">
          <span>Showing {{ filtered.length }} of {{ bookings.length }} bookings</span>
        </div>

        <!-- Empty -->
        <div class="empty-state" *ngIf="filtered.length === 0">
          <div class="empty-icon"><i class="bi bi-calendar2-x"></i></div>
          <h3>No bookings found</h3>
          <p>Try adjusting your filters.</p>
        </div>

        <!-- Table -->
        <div class="table-responsive" *ngIf="filtered.length > 0">
          <table class="ih-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Expert</th>
                <th>Requirement</th>
                <th>Scheduled</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of filtered">
                <td class="text-muted">{{ b.id }}</td>
                <td>
                  <div class="fw-semibold">{{ b.customerName }}</div>
                  <small class="text-muted">{{ b.customerEmail }}</small>
                </td>
                <td>
                  <div class="fw-semibold">{{ b.expertName }}</div>
                  <small class="text-muted">{{ b.expertEmail }}</small>
                </td>
                <td style="max-width:200px;">
                  <span style="font-size:0.875rem;">
                    {{ b.requirementNote | slice:0:80 }}{{ (b.requirementNote?.length ?? 0) > 80 ? '...' : '' }}
                  </span>
                </td>
                <td style="white-space:nowrap;">
                  {{ b.scheduledDate ? (b.scheduledDate | date:'MMM d, y') : '—' }}
                </td>
                <td>
                  <span [class]="'status-badge ' + b.status.toLowerCase()">{{ b.status }}</span>
                </td>
                <td style="white-space:nowrap; color:#6c757d;">
                  {{ b.createdAt | date:'MMM d, y' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class AdminBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  filtered: Booking[] = [];
  loading = true;
  searchTerm = '';
  filterStatus = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.get<Booking[]>('/admin/bookings').subscribe({
      next: (data) => { this.bookings = data; this.filtered = data; this.loading = false; },
      error: ()     => { this.loading = false; }
    });
  }

  applyFilter(): void {
    let result = this.bookings;
    if (this.filterStatus) {
      result = result.filter(b => b.status === this.filterStatus);
    }
    if (this.searchTerm) {
      const t = this.searchTerm.toLowerCase();
      result = result.filter(b =>
        b.customerName.toLowerCase().includes(t) ||
        b.expertName.toLowerCase().includes(t)
      );
    }
    this.filtered = result;
  }
}
