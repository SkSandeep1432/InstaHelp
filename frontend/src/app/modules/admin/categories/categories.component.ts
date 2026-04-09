import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Category } from '../../../core/models/booking.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="page-container">

      <div class="page-header">
        <h1><i class="bi bi-tags-fill me-2" style="color:#6c63ff;"></i>Service Categories</h1>
      </div>

      <div class="row g-4 align-items-start">

        <!-- Add category form -->
        <div class="col-lg-4">
          <div class="ih-card">
            <div class="ih-card-header">
              <i class="bi bi-plus-circle-fill me-2"></i>Add New Category
            </div>
            <div class="ih-card-body">

              <div class="success-message" *ngIf="successMessage">
                <i class="bi bi-check-circle-fill me-2"></i>{{ successMessage }}
              </div>
              <div class="error-message" *ngIf="errorMessage">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
              </div>

              <form [formGroup]="catForm" (ngSubmit)="addCategory()" novalidate>

                <div class="mb-3">
                  <label class="form-label fw-semibold">Category Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control"
                         [class.is-invalid]="submitted && cf['name'].errors"
                         formControlName="name"
                         placeholder="e.g. Web Development">
                  <div class="invalid-feedback">Name is required.</div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">Description</label>
                  <textarea class="form-control" formControlName="description" rows="3"
                            placeholder="Brief description of this service category..."></textarea>
                </div>

                <button type="submit" class="btn btn-primary btn-ih-primary w-100 fw-semibold"
                        [disabled]="adding">
                  <span *ngIf="adding" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!adding" class="bi bi-plus-lg me-2"></i>
                  {{ adding ? 'Adding...' : 'Add Category' }}
                </button>

              </form>
            </div>
          </div>
        </div>

        <!-- Category list -->
        <div class="col-lg-8">
          <div class="ih-card">
            <div class="ih-card-header">
              <i class="bi bi-list-ul me-2"></i>All Categories
              <span class="badge ms-2" style="background:#6c63ff;">{{ categories.length }}</span>
            </div>
            <div class="ih-card-body p-0">

              <div class="loading-container" *ngIf="loading">
                <div class="spinner-border spinner-border-ih" role="status"></div>
              </div>

              <div class="empty-state" *ngIf="!loading && categories.length === 0">
                <div class="empty-icon"><i class="bi bi-tags"></i></div>
                <p>No categories yet. Add one to get started.</p>
              </div>

              <ul class="list-group list-group-flush" *ngIf="!loading && categories.length > 0">
                <li class="list-group-item d-flex align-items-center gap-3 py-3 px-4"
                    *ngFor="let cat of categories">
                  <div class="rounded-2 p-2" style="background:#ede9ff;">
                    <i class="bi bi-tag-fill" style="color:#6c63ff; font-size:1.1rem;"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-semibold">{{ cat.name }}</div>
                    <small class="text-muted">{{ cat.description || 'No description' }}</small>
                  </div>
                  <button class="btn btn-sm btn-outline-danger"
                          (click)="deleteCategory(cat.id)"
                          [disabled]="deletingId === cat.id"
                          title="Delete category">
                    <span *ngIf="deletingId === cat.id" class="spinner-border spinner-border-sm"></span>
                    <i *ngIf="deletingId !== cat.id" class="bi bi-trash3-fill"></i>
                  </button>
                </li>
              </ul>

            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  catForm: FormGroup;
  loading = true;
  adding = false;
  submitted = false;
  deletingId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.catForm = this.fb.group({
      name:        ['', Validators.required],
      description: ['']
    });
  }

  get cf() { return this.catForm.controls; }

  ngOnInit(): void {
    this.apiService.get<Category[]>('/admin/categories').subscribe({
      next: (data) => { this.categories = data; this.loading = false; },
      error: ()     => { this.loading = false; }
    });
  }

  addCategory(): void {
    this.submitted = true;
    if (this.catForm.invalid) return;
    this.adding = true;
    this.clear();

    this.apiService.post<Category>('/admin/categories', this.catForm.value).subscribe({
      next: (cat) => {
        this.categories.push(cat);
        this.catForm.reset();
        this.submitted = false;
        this.successMessage = 'Category added successfully!';
        this.adding = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to add category.';
        this.adding = false;
      }
    });
  }

  deleteCategory(id: number): void {
    if (!confirm('Delete this category? This cannot be undone.')) return;
    this.deletingId = id;
    this.apiService.delete(`/admin/categories/${id}`).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c.id !== id);
        this.deletingId = null;
        this.successMessage = 'Category deleted.';
      },
      error: () => { this.deletingId = null; this.errorMessage = 'Failed to delete category.'; }
    });
  }

  clear(): void { this.successMessage = ''; this.errorMessage = ''; }
}
