package com.instahelp.controller;

import com.instahelp.dto.*;
import com.instahelp.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Customer endpoints. Requires JWT with CUSTOMER role.
 *
 * GET  /api/customer/experts            — list approved experts (filter by ?categoryId=)
 * GET  /api/customer/experts/{id}       — get expert detail
 * POST /api/customer/bookings           — create booking
 * GET  /api/customer/bookings           — get own bookings
 * POST /api/customer/reviews            — post review for a completed booking
 */
@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    // ── Expert Discovery ──────────────────────────────────────────────────

    @GetMapping("/experts")
    public ResponseEntity<List<ExpertProfileDTO>> getApprovedExperts(
            @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(customerService.getApprovedExperts(categoryId));
    }

    @GetMapping("/experts/{id}")
    public ResponseEntity<ExpertProfileDTO> getExpertById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getExpertById(id));
    }

    @GetMapping("/experts/{id}/reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getExpertReviews(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getExpertReviews(id));
    }

    // ── Bookings ──────────────────────────────────────────────────────────

    @PostMapping("/bookings")
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingDTO dto,
            Authentication auth) {
        BookingResponseDTO response = customerService.createBooking(dto, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(Authentication auth) {
        return ResponseEntity.ok(customerService.getMyBookings(auth.getName()));
    }

    // ── Reviews ───────────────────────────────────────────────────────────

    @PostMapping("/reviews")
    public ResponseEntity<ReviewResponseDTO> submitReview(
            @Valid @RequestBody ReviewDTO dto,
            Authentication auth) {
        ReviewResponseDTO response = customerService.submitReview(dto, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ── Dashboard ─────────────────────────────────────────────────────────

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats(Authentication auth) {
        return ResponseEntity.ok(customerService.getDashboardStats(auth.getName()));
    }
}
