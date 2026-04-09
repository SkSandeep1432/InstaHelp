import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ExpertProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1><i class="bi bi-person-check-fill me-2" style="color:#6c63ff;"></i>Expert Approvals</h1>
          <p class="text-muted mb-0">{{ experts.length }} pending registration(s)</p>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading-container" *ngIf="loading">
        <div class="spinner-border spinner-border-ih" role="status"></div>
      </div>

      <!-- Alerts -->
      <div class="success-message" *ngIf="successMessage">
        <i class="bi bi-check-circle-fill me-2"></i>{{ successMessage }}
      </div>
      <div class="error-message" *ngIf="errorMessage">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
      </div>

      <!-- Empty state -->
      <div class="empty-state" *ngIf="!loading && experts.length === 0">
        <div class="empty-icon"><i class="bi bi-check2-circle"></i></div>
        <h3>All caught up!</h3>
        <p>No pending expert registrations at this time.</p>
      </div>

      <!-- Expert cards -->
      <div class="d-flex flex-column gap-4" *ngIf="!loading && experts.length > 0">

        <div class="ih-card" *ngFor="let expert of experts"
             style="border-left: 4px solid #ffc107;">

          <div class="ih-card-body">
            <div class="d-flex align-items-start gap-3 mb-3 flex-wrap">

              <!-- Avatar -->
              <div class="expert-avatar" style="width:52px;height:52px;font-size:1.4rem;flex-shrink:0;">
                {{ expert.name.charAt(0).toUpperCase() }}
              </div>

              <!-- Info -->
              <div class="flex-grow-1">
                <h5 class="fw-bold mb-0">{{ expert.name }}</h5>
                <p class="text-muted small mb-2">{{ expert.email }}</p>

                <div class="row g-2 mb-2">
                  <div class="col-sm-6" *ngIf="expert.category">
                    <small class="text-muted"><i class="bi bi-tags-fill me-1"></i><strong>Category:</strong> {{ expert.category }}</small>
                  </div>
                  <div class="col-sm-6" *ngIf="expert.location">
                    <small class="text-muted"><i class="bi bi-geo-alt-fill me-1"></i><strong>Location:</strong> {{ expert.location }}</small>
                  </div>
                  <div class="col-sm-6" *ngIf="expert.experienceYears">
                    <small class="text-muted"><i class="bi bi-briefcase-fill me-1"></i><strong>Experience:</strong> {{ expert.experienceYears }} years</small>
                  </div>
                </div>

                <p class="mb-2" *ngIf="expert.description" style="font-size:0.9rem; color:#444;">
                  {{ expert.description }}
                </p>

                <div *ngIf="expert.skills" class="d-flex flex-wrap gap-1">
                  <span *ngFor="let skill of getSkills(expert.skills)" class="skill-chip">{{ skill }}</span>
                </div>
              </div>

              <!-- Status pill -->
              <span class="status-badge pending align-self-start">PENDING</span>
            </div>

            <!-- Rejection reason input -->
            <div class="mt-3" *ngIf="rejectingId === expert.userId">
              <label class="form-label fw-semibold">Rejection Reason</label>
              <input type="text" class="form-control mb-2" [(ngModel)]="rejectionReason"
                     placeholder="Provide a reason so the expert can improve their application...">
            </div>

            <!-- Action buttons -->
            <div class="d-flex gap-2 flex-wrap mt-3">
              <ng-container *ngIf="rejectingId !== expert.userId">
                <button class="btn btn-success fw-semibold"
                        (click)="approve(expert.userId)"
                        [disabled]="processingId === expert.userId">
                  <span *ngIf="processingId === expert.userId" class="spinner-border spinner-border-sm me-1"></span>
                  <i *ngIf="processingId !== expert.userId" class="bi bi-check-circle-fill me-1"></i>
                  Approve
                </button>
                <button class="btn btn-outline-danger fw-semibold"
                        (click)="startReject(expert.userId)">
                  <i class="bi bi-x-circle-fill me-1"></i> Reject
                </button>
              </ng-container>

              <ng-container *ngIf="rejectingId === expert.userId">
                <button class="btn btn-danger fw-semibold"
                        (click)="confirmReject(expert.userId)"
                        [disabled]="processingId === expert.userId">
                  <span *ngIf="processingId === expert.userId" class="spinner-border spinner-border-sm me-1"></span>
                  <i *ngIf="processingId !== expert.userId" class="bi bi-send-fill me-1"></i>
                  Confirm Rejection
                </button>
                <button class="btn btn-outline-secondary" (click)="cancelReject()">Cancel</button>
              </ng-container>
            </div>

          </div>
        </div>

      </div>
    </div>
  `
})
export class UserApprovalsComponent implements OnInit {
  experts: ExpertProfile[] = [];
  loading = true;
  processingId: number | null = null;
  rejectingId: number | null = null;
  rejectionReason = '';
  successMessage = '';
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.apiService.get<ExpertProfile[]>('/admin/experts/pending').subscribe({
      next: (data) => { this.experts = data; this.loading = false; },
      error: ()     => { this.loading = false; this.errorMessage = 'Failed to load pending experts.'; }
    });
  }

  approve(userId: number): void {
    this.processingId = userId;
    this.clear();
    this.apiService.put(`/admin/experts/${userId}/approve`, {}).subscribe({
      next: () => {
        this.successMessage = 'Expert approved successfully!';
        this.experts = this.experts.filter(e => e.userId !== userId);
        this.processingId = null;
      },
      error: () => { this.errorMessage = 'Failed to approve expert.'; this.processingId = null; }
    });
  }

  startReject(userId: number): void {
    this.rejectingId = userId;
    this.rejectionReason = '';
  }

  cancelReject(): void { this.rejectingId = null; this.rejectionReason = ''; }

  confirmReject(userId: number): void {
    this.processingId = userId;
    this.clear();
    this.apiService.put(`/admin/experts/${userId}/reject`, { reason: this.rejectionReason }).subscribe({
      next: () => {
        this.successMessage = 'Expert rejected.';
        this.experts = this.experts.filter(e => e.userId !== userId);
        this.rejectingId = null;
        this.processingId = null;
      },
      error: () => { this.errorMessage = 'Failed to reject expert.'; this.processingId = null; }
    });
  }

  getSkills(skills: string): string[] {
    return skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  }

  clear(): void { this.successMessage = ''; this.errorMessage = ''; }
}
