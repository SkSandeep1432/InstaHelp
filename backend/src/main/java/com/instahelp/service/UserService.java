package com.instahelp.service;

import com.instahelp.dto.BookingResponseDTO;
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
public class UserService {

    private final UserRepository userRepository;
    private final ExpertProfileRepository expertProfileRepository;
    private final CategoryRepository categoryRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    // ── Profile ──────────────────────────────────────────────────────────────

    public ExpertProfileDTO getProfile(String email) {
        User user = getUserByEmail(email);
        ExpertProfile profile = expertProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Expert profile not found"));
        Double avgRating = reviewRepository.findAverageRatingByExpertId(user.getId());
        long totalReviews = reviewRepository.countByExpert(user);

        return toExpertProfileDTO(user, profile, avgRating, totalReviews);
    }

    @Transactional
    public ExpertProfileDTO updateProfile(String email, ExpertProfileDTO dto) {
        User user = getUserByEmail(email);
        ExpertProfile profile = expertProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Expert profile not found"));

        if (dto.getWorkDescription() != null) {
            profile.setWorkDescription(dto.getWorkDescription());
        }
        if (dto.getSkills() != null) {
            profile.setSkills(dto.getSkills());
        }
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));
            profile.setCategory(category);
        }
        // Allow toggling availability
        profile.setAvailability(dto.isAvailability());

        expertProfileRepository.save(profile);

        // Allow updating the display name
        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setName(dto.getName());
            userRepository.save(user);
        }

        return getProfile(email);
    }

    // ── Bookings ─────────────────────────────────────────────────────────────

    public List<BookingResponseDTO> getMyBookings(String email) {
        User user = getUserByEmail(email);
        return bookingRepository.findByExpertOrderByCreatedAtDesc(user).stream()
                .map(this::toBookingResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Accept a booking assigned to the currently-authenticated expert.
     */
    @Transactional
    public BookingResponseDTO acceptBooking(Long bookingId, String email) {
        return changeBookingStatus(bookingId, email, BookingStatus.ACCEPTED);
    }

    /**
     * Decline a booking assigned to the currently-authenticated expert.
     */
    @Transactional
    public BookingResponseDTO declineBooking(Long bookingId, String email) {
        return changeBookingStatus(bookingId, email, BookingStatus.DECLINED);
    }

    /**
     * Mark an ACCEPTED booking as COMPLETED.
     */
    @Transactional
    public BookingResponseDTO completeBooking(Long bookingId, String email) {
        User user = getUserByEmail(email);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        if (!booking.getExpert().getId().equals(user.getId())) {
            throw new BadRequestException("You are not authorized to update this booking");
        }
        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new BadRequestException("Only ACCEPTED bookings can be marked as completed");
        }
        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);
        return toBookingResponseDTO(booking);
    }

    public Map<String, Long> getDashboardStats(String email) {
        User user = getUserByEmail(email);
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalBookings", bookingRepository.countByExpert(user));
        stats.put("pendingBookings", bookingRepository.countByExpertAndStatus(user, BookingStatus.PENDING));
        stats.put("acceptedBookings", bookingRepository.countByExpertAndStatus(user, BookingStatus.ACCEPTED));
        stats.put("completedBookings", bookingRepository.countByExpertAndStatus(user, BookingStatus.COMPLETED));
        return stats;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private BookingResponseDTO changeBookingStatus(Long bookingId, String email, BookingStatus newStatus) {
        User user = getUserByEmail(email);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getExpert().getId().equals(user.getId())) {
            throw new BadRequestException("You are not authorized to update this booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be accepted or declined");
        }

        booking.setStatus(newStatus);
        bookingRepository.save(booking);
        return toBookingResponseDTO(booking);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private ExpertProfileDTO toExpertProfileDTO(User user, ExpertProfile profile,
                                                Double avgRating, long totalReviews) {
        return ExpertProfileDTO.builder()
                .id(profile.getId())
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .status(profile.getStatus().name())
                .categoryId(profile.getCategory() != null ? profile.getCategory().getId() : null)
                .categoryName(profile.getCategory() != null ? profile.getCategory().getName() : null)
                .workDescription(profile.getWorkDescription())
                .skills(profile.getSkills())
                .availability(profile.isAvailability())
                .rejectionReason(profile.getRejectionReason())
                .averageRating(avgRating)
                .totalReviews((int) totalReviews)
                .build();
    }

    private BookingResponseDTO toBookingResponseDTO(Booking booking) {
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
