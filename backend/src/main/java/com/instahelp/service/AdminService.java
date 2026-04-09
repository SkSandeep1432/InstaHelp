package com.instahelp.service;

import com.instahelp.dto.ApprovalDTO;
import com.instahelp.dto.BookingResponseDTO;
import com.instahelp.dto.CategoryDTO;
import com.instahelp.dto.ExpertProfileDTO;
import com.instahelp.exception.BadRequestException;
import com.instahelp.exception.ResourceNotFoundException;
import com.instahelp.model.*;
import com.instahelp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ExpertProfileRepository expertProfileRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final CategoryRepository categoryRepository;

    // ── Expert Approval Management ──────────────────────────────────────────

    /**
     * Return all experts whose profile status is PENDING.
     */
    public List<ExpertProfileDTO> getPendingExperts() {
        List<ExpertProfile> pendingProfiles = expertProfileRepository.findByStatus(ExpertStatus.PENDING);
        return pendingProfiles.stream()
                .map(p -> buildExpertProfileDTO(p.getUser(), p))
                .collect(Collectors.toList());
    }

    /**
     * Approve an expert by their user id.
     */
    @Transactional
    public void approveExpert(Long expertUserId) {
        ExpertProfile profile = getExpertProfileByUserId(expertUserId);
        profile.setStatus(ExpertStatus.APPROVED);
        profile.setRejectionReason(null);
        expertProfileRepository.save(profile);
    }

    /**
     * Reject an expert by their user id, optionally with a reason.
     */
    @Transactional
    public void rejectExpert(Long expertUserId, ApprovalDTO dto) {
        ExpertProfile profile = getExpertProfileByUserId(expertUserId);
        profile.setStatus(ExpertStatus.REJECTED);
        if (dto != null && dto.getReason() != null) {
            profile.setRejectionReason(dto.getReason());
        }
        expertProfileRepository.save(profile);
    }

    // ── Booking Management ───────────────────────────────────────────────────

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::buildBookingResponseDTO)
                .collect(Collectors.toList());
    }

    // ── Category Management ───────────────────────────────────────────────────

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional
    public Category createCategory(CategoryDTO dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Category with name '" + dto.getName() + "' already exists");
        }
        Category category = Category.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    // ── Dashboard Stats ──────────────────────────────────────────────────────

    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalExperts", userRepository.countByRole(Role.EXPERT));
        stats.put("pendingApprovals", expertProfileRepository.countByStatus(ExpertStatus.PENDING));
        stats.put("totalCustomers", userRepository.countByRole(Role.CUSTOMER));
        stats.put("totalBookings", bookingRepository.count());
        return stats;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private ExpertProfile getExpertProfileByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getRole() != Role.EXPERT) {
            throw new BadRequestException("User is not an expert");
        }

        return expertProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Expert profile not found for user id: " + userId));
    }

    private ExpertProfileDTO buildExpertProfileDTO(User user, ExpertProfile profile) {
        Double avgRating = reviewRepository.findAverageRatingByExpertId(user.getId());
        long totalReviews = reviewRepository.countByExpert(user);

        return ExpertProfileDTO.builder()
                .id(profile != null ? profile.getId() : null)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .status(profile != null ? profile.getStatus().name() : ExpertStatus.PENDING.name())
                .categoryId(profile != null && profile.getCategory() != null ? profile.getCategory().getId() : null)
                .categoryName(profile != null && profile.getCategory() != null ? profile.getCategory().getName() : null)
                .workDescription(profile != null ? profile.getWorkDescription() : null)
                .skills(profile != null ? profile.getSkills() : null)
                .availability(profile != null && profile.isAvailability())
                .rejectionReason(profile != null ? profile.getRejectionReason() : null)
                .averageRating(avgRating)
                .totalReviews((int) totalReviews)
                .build();
    }

    private BookingResponseDTO buildBookingResponseDTO(Booking booking) {
        return BookingResponseDTO.builder()
                .id(booking.getId())
                .customerId(booking.getCustomer().getId())
                .customerName(booking.getCustomer().getName())
                .customerEmail(booking.getCustomer().getEmail())
                .expertId(booking.getExpert().getId())
                .expertName(booking.getExpert().getName())
                .expertEmail(booking.getExpert().getEmail())
                .requirementNote(booking.getRequirementNote())
                .status(booking.getStatus().name())
                .createdAt(booking.getCreatedAt())
                .scheduledDate(booking.getScheduledDate())
                .build();
    }
}
