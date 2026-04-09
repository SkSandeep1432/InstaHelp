package com.instahelp.controller;

import com.instahelp.dto.LoginRequestDTO;
import com.instahelp.dto.LoginResponseDTO;
import com.instahelp.dto.RegisterRequestDTO;
import com.instahelp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public authentication endpoints — no JWT required.
 * POST /api/auth/register/expert  — register as expert (starts as PENDING)
 * POST /api/auth/register/customer — register as customer (immediately active)
 * POST /api/auth/login             — login and receive JWT
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** Unified endpoint — dispatches based on role field ("EXPERT" or "CUSTOMER") */
    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        LoginResponseDTO response = "EXPERT".equalsIgnoreCase(request.getRole())
                ? authService.registerExpert(request)
                : authService.registerCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/register/expert")
    public ResponseEntity<LoginResponseDTO> registerExpert(@Valid @RequestBody RegisterRequestDTO request) {
        LoginResponseDTO response = authService.registerExpert(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/register/customer")
    public ResponseEntity<LoginResponseDTO> registerCustomer(@Valid @RequestBody RegisterRequestDTO request) {
        LoginResponseDTO response = authService.registerCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
