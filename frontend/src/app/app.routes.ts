import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/customer/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./modules/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Admin routes — role stored as 'ADMIN'
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('ADMIN')],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'user-approvals',
        loadComponent: () => import('./modules/admin/user-approvals/user-approvals.component').then(m => m.UserApprovalsComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./modules/admin/bookings/bookings.component').then(m => m.AdminBookingsComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./modules/admin/categories/categories.component').then(m => m.CategoriesComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Expert/User routes — role stored as 'EXPERT'
  {
    path: 'user',
    canActivate: [authGuard, roleGuard('EXPERT')],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/user/dashboard/dashboard.component').then(m => m.UserDashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./modules/user/profile/profile.component').then(m => m.UserProfileComponent)
      },
      {
        path: 'my-bookings',
        loadComponent: () => import('./modules/user/my-bookings/my-bookings.component').then(m => m.UserMyBookingsComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Customer routes — home & list are public; bookings & book require CUSTOMER role
  {
    path: 'customer',
    children: [
      {
        path: 'home',
        loadComponent: () => import('./modules/customer/home/home.component').then(m => m.CustomerHomeComponent)
      },
      {
        path: 'experts',
        loadComponent: () => import('./modules/customer/expert-list/expert-list.component').then(m => m.ExpertListComponent)
      },
      {
        path: 'experts/:id',
        loadComponent: () => import('./modules/customer/expert-detail/expert-detail.component').then(m => m.ExpertDetailComponent)
      },
      {
        path: 'book/:id',
        canActivate: [authGuard, roleGuard('CUSTOMER')],
        loadComponent: () => import('./modules/customer/book-expert/book-expert.component').then(m => m.BookExpertComponent)
      },
      {
        path: 'my-bookings',
        canActivate: [authGuard, roleGuard('CUSTOMER')],
        loadComponent: () => import('./modules/customer/my-bookings/my-bookings.component').then(m => m.CustomerMyBookingsComponent)
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '/customer/home' }
];
