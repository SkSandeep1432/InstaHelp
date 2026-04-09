import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">

        <!-- Logo -->
        <div class="auth-logo">
          <i class="bi bi-lightning-charge-fill logo-icon"></i>
          <h2>InstaHelp</h2>
          <p>Sign in to your account</p>
        </div>

        <!-- Error -->
        <div class="error-message" *ngIf="errorMessage">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
        </div>

        <!-- Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>

          <div class="mb-3">
            <label class="form-label fw-semibold">Email address</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
              <input type="email" class="form-control"
                     [class.is-invalid]="submitted && f['email'].errors"
                     formControlName="email"
                     placeholder="you@example.com">
              <div class="invalid-feedback">
                <span *ngIf="f['email'].errors?.['required']">Email is required.</span>
                <span *ngIf="f['email'].errors?.['email']">Enter a valid email address.</span>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold">Password</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
              <input [type]="showPwd ? 'text' : 'password'" class="form-control"
                     [class.is-invalid]="submitted && f['password'].errors"
                     formControlName="password"
                     placeholder="Your password">
              <button class="btn btn-outline-secondary" type="button" (click)="showPwd = !showPwd">
                <i [class]="showPwd ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
              <div class="invalid-feedback">Password is required.</div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-ih-primary w-100 py-2 fw-semibold"
                  [disabled]="loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i *ngIf="!loading" class="bi bi-box-arrow-in-right me-2"></i>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <hr class="my-4">

        <p class="text-center mb-0 text-muted" style="font-size:0.9rem;">
          Don't have an account?
          <a routerLink="/register" class="fw-semibold text-decoration-none" style="color:#6c63ff;">
            Register here
          </a>
        </p>

      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  showPwd = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.redirectByRole(res.role);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }

  private redirectByRole(role: string): void {
    switch (role) {
      case 'ADMIN':    this.router.navigate(['/admin/dashboard']); break;
      case 'EXPERT':   this.router.navigate(['/user/dashboard']);  break;
      case 'CUSTOMER': this.router.navigate(['/customer/home']);   break;
      default:         this.router.navigate(['/customer/home']);
    }
  }
}
