package com.instahelp.controller;

import com.instahelp.dto.BookingResponseDTO;
import com.instahelp.dto.ExpertProfileDTO;
import com.instahelp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Expert (USER role) endpoints. Requires JWT with EXPERT role.
 *
 * GET  /api/user/profile                  — get own expert profile
 * PUT  /api/user/profile                  — update own expert profile
 * GET  /api/user/bookings                 — bookings assigned to this expert
 * PUT  /api/user/bookings/{id}/accept     — accept a booking
 * PUT  /api/user/bookings/{id}/decline    — decline a booking
 */
@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ExpertProfileDTO> getProfile(Authentication auth) {
        return ResponseEntity.ok(userService.getProfile(auth.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ExpertProfileDTO> updateProfile(
            @RequestBody ExpertProfileDTO dto,
            Authentication auth) {
        return ResponseEntity.ok(userService.updateProfile(auth.getName(), dto));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(Authentication auth) {
        return ResponseEntity.ok(userService.getMyBookings(auth.getName()));
    }

    @PutMapping("/bookings/{id}/accept")
    public ResponseEntity<BookingResponseDTO> acceptBooking(
            @PathVariable Long id,
            Authentication auth) {
        return ResponseEntity.ok(userService.acceptBooking(id, auth.getName()));
    }

    @PutMapping("/bookings/{id}/decline")
    public ResponseEntity<BookingResponseDTO> declineBooking(
            @PathVariable Long id,
            Authentication auth) {
        return ResponseEntity.ok(userService.declineBooking(id, auth.getName()));
    }

    @PutMapping("/bookings/{id}/complete")
    public ResponseEntity<BookingResponseDTO> completeBooking(
            @PathVariable Long id,
            Authentication auth) {
        return ResponseEntity.ok(userService.completeBooking(id, auth.getName()));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats(Authentication auth) {
        return ResponseEntity.ok(userService.getDashboardStats(auth.getName()));
    }
}
