package com.instahelp.service;

import com.instahelp.config.JwtUtil;
import com.instahelp.dto.LoginRequestDTO;
import com.instahelp.dto.LoginResponseDTO;
import com.instahelp.dto.RegisterRequestDTO;
import com.instahelp.exception.BadRequestException;
import com.instahelp.model.*;
import com.instahelp.repository.CategoryRepository;
import com.instahelp.repository.ExpertProfileRepository;
import com.instahelp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ExpertProfileRepository expertProfileRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Register a new expert (USER role in spec). Profile starts as PENDING.
     */
    @Transactional
    public LoginResponseDTO registerExpert(RegisterRequestDTO request) {
        validateEmailUniqueness(request.getEmail());

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.EXPERT)
                .build();

        user = userRepository.save(user);

        // Resolve optional category FK
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }

        ExpertProfile profile = ExpertProfile.builder()
                .user(user)
                .category(category)
                .workDescription(request.getWorkDescription())
                .skills(request.getSkills())
                .status(ExpertStatus.PENDING)
                .availability(true)
                .build();

        expertProfileRepository.save(profile);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return LoginResponseDTO.builder()
                .token(token)
                .role(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .id(user.getId())
                .status(ExpertStatus.PENDING.name())
                .build();
    }

    /**
     * Register a new customer. Account is immediately active.
     */
    @Transactional
    public LoginResponseDTO registerCustomer(RegisterRequestDTO request) {
        validateEmailUniqueness(request.getEmail());

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER)
                .build();

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return LoginResponseDTO.builder()
                .token(token)
                .role(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .id(user.getId())
                .status("ACTIVE")
                .build();
    }

    /**
     * Login any role. For experts, also checks approval status.
     */
    public LoginResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        // For experts, check approval status from ExpertProfile
        String statusLabel = "ACTIVE";
        if (user.getRole() == Role.EXPERT) {
            ExpertProfile profile = expertProfileRepository.findByUser(user)
                    .orElseThrow(() -> new BadRequestException("Expert profile not found"));

            if (profile.getStatus() == ExpertStatus.PENDING) {
                throw new BadRequestException("Your account is pending approval by admin");
            }
            if (profile.getStatus() == ExpertStatus.REJECTED) {
                String reason = profile.getRejectionReason() != null
                        ? ": " + profile.getRejectionReason() : "";
                throw new BadRequestException("Your account has been rejected" + reason);
            }
            statusLabel = profile.getStatus().name();
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return LoginResponseDTO.builder()
                .token(token)
                .role(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .id(user.getId())
                .status(statusLabel)
                .build();
    }

    private void validateEmailUniqueness(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already registered");
        }
    }
}
