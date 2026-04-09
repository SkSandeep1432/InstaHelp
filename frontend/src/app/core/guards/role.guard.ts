import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (requiredRole: string): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    const userRole = authService.getRole();
    if (userRole === requiredRole) {
      return true;
    }

    // Redirect to appropriate dashboard
    switch (userRole) {
      case 'ADMIN':
        router.navigate(['/admin/dashboard']);
        break;
      case 'EXPERT':
        router.navigate(['/user/dashboard']);
        break;
      case 'CUSTOMER':
        router.navigate(['/customer/home']);
        break;
      default:
        router.navigate(['/login']);
    }

    return false;
  };
};
