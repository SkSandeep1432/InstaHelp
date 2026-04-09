import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ExpertProfile } from '../../../core/models/user.model';
import { Category } from '../../../core/models/booking.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">

      <div class="page-header">
        <h1><i class="bi bi-person-circle me-2" style="color:#6c63ff;"></i>My Profile</h1>
      </div>

      <div class="loading-container" *ngIf="loading">
        <div class="spinner-border spinner-border-ih" role="status"></div>
      </div>

      <div class="row g-4 align-items-start" *ngIf="!loading">

        <!-- Profile summary card -->
        <div class="col-lg-4">
          <div class="ih-card text-center">
            <div class="ih-card-body py-4">
              <div class="expert-avatar mx-auto mb-3" style="width:90px;height:90px;font-size:2.2rem;">
                {{ profile?.name?.charAt(0)?.toUpperCase() }}
              </div>
              <h4 class="fw-bold mb-0">{{ profile?.name }}</h4>
              <p class="text-muted small mb-2">{{ profile?.email }}</p>
              <p class="mb-2" style="color:#6c63ff; font-weight:600;">{{ profile?.category }}</p>

              <span [class]="'status-badge ' + (profile?.status || '').toLowerCase()">
                {{ profile?.status }}
              </span>

              <div *ngIf="profile?.averageRating" class="mt-3">
                <span class="rating-stars" style="font-size:1.2rem;">
                  <span *ngFor="let s of getStars(profile!.averageRating)">★</span>
                  <span style="color:#ddd;" *ngFor="let s of getEmptyStars(profile!.averageRating)">★</span>
                </span>
                <div class="text-muted small">{{ profile?.averageRating?.toFixed(1) }} / 5 ({{ profile?.totalReviews }} reviews)</div>
              </div>

              <hr class="my-3">

              <div class="text-start small text-muted">
                <div *ngIf="profile?.location" class="mb-1">
                  <i class="bi bi-geo-alt-fill me-2"></i>{{ profile?.location }}
                </div>
                <div *ngIf="profile?.experienceYears">
                  <i class="bi bi-briefcase-fill me-2"></i>{{ profile?.experienceYears }} years experience
                </div>
              </div>

              <div *ngIf="profile?.skills" class="mt-3 d-flex flex-wrap gap-1 justify-content-center">
                <span *ngFor="let skill of getSkills(profile!.skills)" class="skill-chip">{{ skill }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit form -->
        <div class="col-lg-8">
          <div class="ih-card">
            <div class="ih-card-header"><i class="bi bi-pencil-fill me-2"></i>Edit Profile</div>
            <div class="ih-card-body">

              <div class="success-message" *ngIf="successMessage">
                <i class="bi bi-check-circle-fill me-2"></i>{{ successMessage }}
              </div>
              <div class="error-message" *ngIf="errorMessage">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
              </div>

              <form [formGroup]="profileForm" (ngSubmit)="onSave()">

                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Full Name</label>
                    <input type="text" class="form-control" formControlName="name">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Service Category</label>
                    <select class="form-select" formControlName="category">
                      <option value="">-- Select --</option>
                      <option *ngFor="let cat of categories" [value]="cat.name">{{ cat.name }}</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">Description / About You</label>
                  <textarea class="form-control" formControlName="description" rows="4"
                            placeholder="Describe your expertise and the services you offer..."></textarea>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Skills <small class="text-muted">(comma-separated)</small>
                  </label>
                  <input type="text" class="form-control" formControlName="skills"
                         placeholder="e.g. JavaScript, Python, Graphic Design">
                </div>

                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Years of Experience</label>
                    <input type="number" class="form-control" formControlName="experienceYears" min="0">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Location</label>
                    <input type="text" class="form-control" formControlName="location"
                           placeholder="e.g. New York, Remote">
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-semibold">Profile Image URL <small class="text-muted">(optional)</small></label>
                  <input type="url" class="form-control" formControlName="profileImageUrl"
                         placeholder="https://example.com/photo.jpg">
                </div>

                <!-- Availability toggle -->
                <div class="mb-4 d-flex align-items-center gap-3">
                  <div class="form-check form-switch mb-0">
                    <input class="form-check-input" type="checkbox" id="availToggle"
                           [checked]="profileForm.get('available')?.value"
                           (change)="toggleAvailability($event)">
                    <label class="form-check-label fw-semibold" for="availToggle">
                      <i class="bi bi-circle-fill me-1"
                         [style.color]="profileForm.get('available')?.value ? '#28a745' : '#dc3545'"></i>
                      {{ profileForm.get('available')?.value ? 'Available for bookings' : 'Not available' }}
                    </label>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary btn-ih-primary fw-semibold px-4"
                        [disabled]="saving">
                  <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!saving" class="bi bi-save-fill me-2"></i>
                  {{ saving ? 'Saving...' : 'Save Changes' }}
                </button>

              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class UserProfileComponent implements OnInit {
  profile: ExpertProfile | null = null;
  profileForm: FormGroup;
  categories: Category[] = [];
  loading = true;
  saving = false;
  successMessage = '';
  errorMessage = '';

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name:            [''],
      category:        [''],
      description:     [''],
      skills:          [''],
      experienceYears: [0],
      location:        [''],
      profileImageUrl: [''],
      available:       [true]
    });
  }

  ngOnInit(): void {
    this.apiService.get<ExpertProfile>('/user/profile').subscribe({
      next: (p) => { this.profile = p; this.profileForm.patchValue(p); this.loading = false; },
      error: ()  => { this.loading = false; }
    });
    this.apiService.get<Category[]>('/public/categories').subscribe({
      next: (cats) => this.categories = cats,
      error: ()     => this.categories = []
    });
  }

  toggleAvailability(event: Event): void {
    this.profileForm.patchValue({ available: (event.target as HTMLInputElement).checked });
  }

  onSave(): void {
    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.apiService.put<ExpertProfile>('/user/profile', this.profileForm.value).subscribe({
      next: (p) => {
        this.profile = p;
        this.successMessage = 'Profile updated successfully!';
        this.saving = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update profile.';
        this.saving = false;
      }
    });
  }

  getSkills(skills: string): string[] {
    return skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  }

  getStars(rating: number): number[] { return Array(Math.round(rating)).fill(0); }
  getEmptyStars(rating: number): number[] { return Array(5 - Math.round(rating)).fill(0); }
}
