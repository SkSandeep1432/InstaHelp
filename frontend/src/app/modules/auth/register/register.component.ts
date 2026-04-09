import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { Category } from '../../../core/models/booking.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper" style="align-items: flex-start; padding-top: 2rem;">
      <div class="auth-card" style="max-width: 560px; margin: 0 auto;">

        <!-- Logo -->
        <div class="auth-logo">
          <i class="bi bi-lightning-charge-fill logo-icon"></i>
          <h2>InstaHelp</h2>
          <p>Create your account</p>
        </div>

        <!-- Role tabs -->
        <ul class="nav nav-pills nav-fill mb-4" id="roleTabs">
          <li class="nav-item">
            <button class="nav-link fw-semibold"
                    [class.active]="selectedRole === 'CUSTOMER'"
                    (click)="setRole('CUSTOMER')" type="button">
              <i class="bi bi-person-fill me-1"></i> Customer
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link fw-semibold"
                    [class.active]="selectedRole === 'USER'"
                    (click)="setRole('USER')" type="button">
              <i class="bi bi-briefcase-fill me-1"></i> Expert
            </button>
          </li>
        </ul>

        <!-- Alerts -->
        <div class="error-message"   *ngIf="errorMessage">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
        </div>
        <div class="success-message" *ngIf="successMessage">
          <i class="bi bi-check-circle-fill me-2"></i>{{ successMessage }}
        </div>

        <!-- Expert info banner -->
        <div class="alert alert-info d-flex align-items-start gap-2 py-2" *ngIf="selectedRole === 'USER'">
          <i class="bi bi-info-circle-fill mt-1"></i>
          <small>Expert accounts require <strong>admin approval</strong> before receiving bookings.</small>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" novalidate>

          <!-- Name -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Full Name</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
              <input type="text" class="form-control"
                     [class.is-invalid]="submitted && f['name'].errors"
                     formControlName="name" placeholder="Your full name">
              <div class="invalid-feedback">Name is required.</div>
            </div>
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Email address</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
              <input type="email" class="form-control"
                     [class.is-invalid]="submitted && f['email'].errors"
                     formControlName="email" placeholder="you@example.com">
              <div class="invalid-feedback">
                <span *ngIf="f['email'].errors?.['required']">Email is required.</span>
                <span *ngIf="f['email'].errors?.['email']">Enter a valid email.</span>
              </div>
            </div>
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Password</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
              <input [type]="showPwd ? 'text' : 'password'" class="form-control"
                     [class.is-invalid]="submitted && f['password'].errors"
                     formControlName="password" placeholder="At least 6 characters">
              <button class="btn btn-outline-secondary" type="button" (click)="showPwd = !showPwd">
                <i [class]="showPwd ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
              <div class="invalid-feedback">
                <span *ngIf="f['password'].errors?.['required']">Password is required.</span>
                <span *ngIf="f['password'].errors?.['minlength']">Minimum 6 characters.</span>
              </div>
            </div>
          </div>

          <!-- Expert-only fields -->
          <ng-container *ngIf="selectedRole === 'USER'">
            <hr class="my-3">
            <p class="fw-semibold text-muted mb-3" style="font-size:0.85rem; text-transform:uppercase; letter-spacing:0.5px;">
              Expert Profile Details
            </p>

            <!-- Category -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Service Category</label>
              <select class="form-select" formControlName="categoryId">
                <option value="">-- Select a category --</option>
                <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <!-- Description -->
            <div class="mb-3">
              <label class="form-label fw-semibold">About You / Description</label>
              <textarea class="form-control" formControlName="description" rows="3"
                        placeholder="Describe your expertise and the services you offer..."></textarea>
            </div>

            <!-- Skills -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Skills <small class="text-muted">(comma-separated)</small></label>
              <input type="text" class="form-control" formControlName="skills"
                     placeholder="e.g. JavaScript, React, Node.js">
            </div>

            <!-- Experience + Location row -->
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
          </ng-container>

          <button type="submit" class="btn btn-primary btn-ih-primary w-100 py-2 fw-semibold mt-2"
                  [disabled]="loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i *ngIf="!loading" class="bi bi-person-plus-fill me-2"></i>
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <hr class="my-4">
        <p class="text-center mb-0 text-muted" style="font-size:0.9rem;">
          Already have an account?
          <a routerLink="/login" class="fw-semibold text-decoration-none" style="color:#6c63ff;">
            Sign in
          </a>
        </p>

      </div>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  showPwd = false;
  selectedRole = 'CUSTOMER';
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name:            ['', Validators.required],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      role:            ['CUSTOMER'],
      categoryId:      [''],
      description:     [''],
      skills:          [''],
      experienceYears: [0],
      location:        ['']
    });
  }

  get f() { return this.registerForm.controls; }

  ngOnInit(): void {
    this.apiService.get<Category[]>('/public/categories').subscribe({
      next: (cats) => this.categories = cats,
      error: () => this.categories = []
    });
  }

  setRole(role: string): void {
    this.selectedRole = role;
    this.registerForm.patchValue({ role });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const v = this.registerForm.value;
    // Map frontend role label to backend expected value
    const backendRole = this.selectedRole === 'USER' ? 'EXPERT' : 'CUSTOMER';
    const payload: any = {
      name: v.name, email: v.email, password: v.password, role: backendRole
    };

    if (this.selectedRole === 'USER') {
      payload.categoryId      = v.categoryId ? Number(v.categoryId) : null;
      payload.workDescription = v.description;
      payload.skills          = v.skills;
    }

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.role === 'EXPERT' && res.status === 'PENDING') {
          this.successMessage = 'Registration successful! Your expert account is pending admin approval. You will be redirected to login shortly.';
          setTimeout(() => this.router.navigate(['/login']), 3500);
        } else {
          this.redirectByRole(res.role);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  private redirectByRole(role: string): void {
    switch (role) {
      case 'ADMIN':    this.router.navigate(['/admin/dashboard']); break;
      case 'EXPERT':   this.router.navigate(['/user/dashboard']);  break;
      case 'CUSTOMER': this.router.navigate(['/customer/home']);   break;
      default:         this.router.navigate(['/login']);
    }
  }
}
