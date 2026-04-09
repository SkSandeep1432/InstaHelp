package com.instahelp.service;

import com.instahelp.dto.*;
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
public class CustomerService {

    private final UserRepository userRepository;
    private final ExpertProfileRepository expertProfileRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    // ── Expert Discovery ──────────────────────────────────────────────────────

    /**
     * List all approved experts, optionally filtered by category.
     */
    public List<ExpertProfileDTO> getApprovedExperts(Long categoryId) {
        List<ExpertProfile> profiles;

        if (categoryId != null) {
            profiles = expertProfileRepository.findByCategoryId(categoryId).stream()
                    .filter(p -> p.getStatus() == ExpertStatus.APPROVED)
                    .collect(Collectors.toList());
        } else {
            profiles = expertProfileRepository.findByStatus(ExpertStatus.APPROVED);
        }

        return profiles.stream()
                .map(p -> buildExpertProfileDTO(p.getUser(), p))
                .collect(Collectors.toList());
    }

    /**
     * Get a single approved expert's details by their user id.
     */
    public ExpertProfileDTO getExpertById(Long expertUserId) {
        User user = userRepository.findById(expertUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Expert not found with id: " + expertUserId));

        if (user.getRole() != Role.EXPERT) {
            throw new ResourceNotFoundException("User is not an expert");
        }

        ExpertProfile profile = expertProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Expert profile not found"));

        if (profile.getStatus() != ExpertStatus.APPROVED) {
            throw new ResourceNotFoundException("Expert is not yet approved");
        }

        return buildExpertProfileDTO(user, profile);
    }

    // ── Bookings ─────────────────────────────────────────────────────────────

    @Transactional
    public BookingResponseDTO createBooking(BookingDTO dto, String customerEmail) {
        User customer = getUserByEmail(customerEmail);
        User expert = userRepository.findById(dto.getExpertId())
                .orElseThrow(() -> new ResourceNotFoundException("Expert not found with id: " + dto.getExpertId()));

        if (expert.getRole() != Role.EXPERT) {
            throw new BadRequestException("Target user is not an expert");
        }

        ExpertProfile expertProfile = expertProfileRepository.findByUser(expert)
                .orElseThrow(() -> new ResourceNotFoundException("Expert profile not found"));

        if (expertProfile.getStatus() != ExpertStatus.APPROVED) {
            throw new BadRequestException("This expert is not approved and cannot be booked");
        }

        if (!expertProfile.isAvailability()) {
            throw new BadRequestException("This expert is currently not available for bookings");
        }

        Booking booking = Booking.builder()
                .customer(customer)
                .expert(expert)
                .requirementNote(dto.getRequirementNote())
                .scheduledDate(dto.getScheduledDate())
                .status(BookingStatus.PENDING)
                .build();

        booking = bookingRepository.save(booking);
        return toBookingResponseDTO(booking);
    }

    public List<BookingResponseDTO> getMyBookings(String customerEmail) {
        User customer = getUserByEmail(customerEmail);
        return bookingRepository.findByCustomerOrderByCreatedAtDesc(customer).stream()
                .map(this::toBookingResponseDTO)
                .collect(Collectors.toList());
    }

    // ── Reviews ───────────────────────────────────────────────────────────────

    @Transactional
    public ReviewResponseDTO submitReview(ReviewDTO dto, String customerEmail) {
        User customer = getUserByEmail(customerEmail);
        Booking booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + dto.getBookingId()));

        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new BadRequestException("You are not authorized to review this booking");
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Reviews can only be submitted for COMPLETED bookings");
        }

        if (reviewRepository.existsByBooking(booking)) {
            throw new BadRequestException("A review has already been submitted for this booking");
        }

        Review review = Review.builder()
                .booking(booking)
                .customer(customer)
                .expert(booking.getExpert())
                .rating(dto.getRating())
                .comment(dto.getComment())
                .build();

        review = reviewRepository.save(review);
        return toReviewResponseDTO(review);
    }

    public List<ReviewResponseDTO> getExpertReviews(Long expertId) {
        User expert = userRepository.findById(expertId)
                .orElseThrow(() -> new ResourceNotFoundException("Expert not found with id: " + expertId));
        return reviewRepository.findByExpert(expert).stream()
                .map(this::toReviewResponseDTO)
                .collect(Collectors.toList());
    }

    public Map<String, Long> getDashboardStats(String customerEmail) {
        User customer = getUserByEmail(customerEmail);
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalBookings", bookingRepository.countByCustomer(customer));
        stats.put("pendingBookings", bookingRepository.countByCustomerAndStatus(customer, BookingStatus.PENDING));
        stats.put("completedBookings", bookingRepository.countByCustomerAndStatus(customer, BookingStatus.COMPLETED));
        stats.put("declinedBookings", bookingRepository.countByCustomerAndStatus(customer, BookingStatus.DECLINED));
        return stats;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
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

    private ReviewResponseDTO toReviewResponseDTO(Review review) {
        return ReviewResponseDTO.builder()
                .id(review.getId())
                .bookingId(review.getBooking().getId())
                .customerId(review.getCustomer().getId())
                .customerName(review.getCustomer().getName())
                .expertId(review.getExpert().getId())
                .expertName(review.getExpert().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
