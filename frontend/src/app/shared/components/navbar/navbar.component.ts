import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg ih-navbar" *ngIf="isLoggedIn()">
      <div class="container-fluid">

        <!-- Brand -->
        <a class="navbar-brand" routerLink="/">
          <i class="bi bi-lightning-charge-fill brand-icon"></i>
          InstaHelp
        </a>

        <!-- Mobile toggler -->
        <button class="navbar-toggler border-0" type="button"
                data-bs-toggle="collapse" data-bs-target="#mainNav"
                style="color:rgba(255,255,255,0.75)">
          <i class="bi bi-list" style="font-size:1.5rem;"></i>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">

            <!-- Admin links -->
            <ng-container *ngIf="isAdmin()">
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/dashboard" routerLinkActive="active">
                  <i class="bi bi-grid-1x2-fill"></i> Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/user-approvals" routerLinkActive="active">
                  <i class="bi bi-person-check-fill"></i> Approvals
                  <span class="badge bg-warning text-dark ms-1" *ngIf="pendingCount > 0">{{ pendingCount }}</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/bookings" routerLinkActive="active">
                  <i class="bi bi-calendar2-check"></i> Bookings
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/categories" routerLinkActive="active">
                  <i class="bi bi-tags-fill"></i> Categories
                </a>
              </li>
            </ng-container>

            <!-- Expert links -->
            <ng-container *ngIf="isExpert()">
              <li class="nav-item">
                <a class="nav-link" routerLink="/user/dashboard" routerLinkActive="active">
                  <i class="bi bi-grid-1x2-fill"></i> Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/user/profile" routerLinkActive="active">
                  <i class="bi bi-person-circle"></i> Profile
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/user/my-bookings" routerLinkActive="active">
                  <i class="bi bi-calendar2-week"></i> My Bookings
                </a>
              </li>
            </ng-container>

            <!-- Customer links -->
            <ng-container *ngIf="isCustomer()">
              <li class="nav-item">
                <a class="nav-link" routerLink="/customer/home" routerLinkActive="active">
                  <i class="bi bi-house-fill"></i> Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/customer/experts" routerLinkActive="active">
                  <i class="bi bi-people-fill"></i> Find Experts
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/customer/my-bookings" routerLinkActive="active">
                  <i class="bi bi-calendar2-check"></i> My Bookings
                </a>
              </li>
            </ng-container>

          </ul>

          <!-- Right side: user pill + logout -->
          <div class="d-flex align-items-center gap-2">
            <span class="user-pill">
              <i class="bi bi-person-fill"></i>
              {{ getName() }}
              <span class="badge ms-1" [ngClass]="{
                'bg-warning text-dark': isAdmin(),
                'bg-success': isExpert(),
                'bg-info text-dark': isCustomer()
              }" style="font-size:0.65rem;">
                {{ getRole() }}
              </span>
            </span>
            <button class="btn btn-sm btn-logout" (click)="logout()">
              <i class="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        </div>

      </div>
    </nav>
  `
})
export class NavbarComponent {
  pendingCount = 0;

  constructor(private authService: AuthService, private router: Router) {}

  isLoggedIn(): boolean { return this.authService.isLoggedIn(); }
  isAdmin(): boolean    { return this.authService.isAdmin(); }
  isExpert(): boolean   { return this.authService.isExpert(); }
  isCustomer(): boolean { return this.authService.isCustomer(); }
  getName(): string     { return this.authService.getName() || ''; }
  getRole(): string     { return this.authService.getRole() || ''; }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
