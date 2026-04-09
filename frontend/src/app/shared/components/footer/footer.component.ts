import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="ih-footer" *ngIf="isLoggedIn()">
      <div class="container-fluid">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <div>
            <i class="bi bi-lightning-charge-fill" style="color: #6c63ff;"></i>
            <strong style="color:#fff;"> InstaHelp</strong>
            &nbsp;&mdash;&nbsp;Your trusted expert marketplace
          </div>
          <div>
            &copy; {{ year }} InstaHelp. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  year = new Date().getFullYear();
  constructor(private authService: AuthService) {}
  isLoggedIn(): boolean { return this.authService.isLoggedIn(); }
}
