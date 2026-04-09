package com.instahelp.controller;

import com.instahelp.dto.ApprovalDTO;
import com.instahelp.dto.BookingResponseDTO;
import com.instahelp.dto.CategoryDTO;
import com.instahelp.dto.ExpertProfileDTO;
import com.instahelp.model.Category;
import com.instahelp.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin-only endpoints. Requires JWT with ADMIN role.
 *
 * GET  /api/admin/experts/pending      — list pending expert approvals
 * PUT  /api/admin/experts/{id}/approve — approve expert
 * PUT  /api/admin/experts/{id}/reject  — reject expert (body may contain reason)
 * GET  /api/admin/bookings             — all bookings
 * GET  /api/admin/categories           — all categories
 * POST /api/admin/categories           — create category
 * DELETE /api/admin/categories/{id}   — delete category
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ── Expert Approval ────────────────────────────────────────────────────

    @GetMapping("/experts/pending")
    public ResponseEntity<List<ExpertProfileDTO>> getPendingExperts() {
        return ResponseEntity.ok(adminService.getPendingExperts());
    }

    @PutMapping("/experts/{id}/approve")
    public ResponseEntity<Map<String, String>> approveExpert(@PathVariable Long id) {
        adminService.approveExpert(id);
        return ResponseEntity.ok(Map.of("message", "Expert approved successfully"));
    }

    @PutMapping("/experts/{id}/reject")
    public ResponseEntity<Map<String, String>> rejectExpert(
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalDTO dto) {
        adminService.rejectExpert(id, dto);
        return ResponseEntity.ok(Map.of("message", "Expert rejected"));
    }

    // ── Bookings ───────────────────────────────────────────────────────────

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(adminService.getAllBookings());
    }

    // ── Categories ─────────────────────────────────────────────────────────

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(adminService.getAllCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody CategoryDTO dto) {
        Category created = adminService.createCategory(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Map<String, String>> deleteCategory(@PathVariable Long id) {
        adminService.deleteCategory(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted successfully"));
    }

    // ── Dashboard ──────────────────────────────────────────────────────────

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
}
