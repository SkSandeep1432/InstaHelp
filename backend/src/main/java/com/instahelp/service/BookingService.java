package com.instahelp.service;

import com.instahelp.dto.BookingDTO;
import com.instahelp.dto.BookingResponseDTO;
import com.instahelp.exception.BadRequestException;
import com.instahelp.exception.ResourceNotFoundException;
import com.instahelp.model.*;
import com.instahelp.repository.BookingRepository;
import com.instahelp.repository.ExpertProfileRepository;
import com.instahelp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Core booking lifecycle service used by both CustomerService and UserService.
 * Handles creation, status transitions, and querying of bookings.
 */
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ExpertProfileRepository expertProfileRepository;

    // ── Create ────────────────────────────────────────────────────────────────

    @Transactional
    public BookingResponseDTO createBooking(BookingDTO dto, User customer) {
        User expert = userRepository.findById(dto.getExpertId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Expert not found with id: " + dto.getExpertId()));

        if (expert.getRole() != Role.EXPERT) {
            throw new BadRequestException("Target user is not an expert");
        }

        ExpertProfile expertProfile = expertProfileRepository.findByUser(expert)
                .orElseThrow(() -> new ResourceNotFoundException("Expert profile not found"));

        if (expertProfile.getStatus() != ExpertStatus.APPROVED) {
            throw new BadRequestException("Expert is not approved for bookings");
        }

        if (!expertProfile.isAvailability()) {
            throw new BadRequestException("Expert is currently unavailable");
        }

        Booking booking = Booking.builder()
                .customer(customer)
                .expert(expert)
                .requirementNote(dto.getRequirementNote())
                .scheduledDate(dto.getScheduledDate())
                .status(BookingStatus.PENDING)
                .build();

        return toDTO(bookingRepository.save(booking));
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    public List<BookingResponseDTO> getBookingsByCustomer(User customer) {
        return bookingRepository.findByCustomerOrderByCreatedAtDesc(customer)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getBookingsByExpert(User expert) {
        return bookingRepository.findByExpertOrderByCreatedAtDesc(expert)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Status Transitions ────────────────────────────────────────────────────

    @Transactional
    public BookingResponseDTO updateStatus(Long bookingId, BookingStatus newStatus, User requestingUser) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId));

        validateStatusTransition(booking, newStatus, requestingUser);
        booking.setStatus(newStatus);
        return toDTO(bookingRepository.save(booking));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private void validateStatusTransition(Booking booking, BookingStatus newStatus, User actor) {
        switch (newStatus) {
            case ACCEPTED, DECLINED -> {
                // Only the assigned expert may accept or decline
                if (!booking.getExpert().getId().equals(actor.getId())) {
                    throw new BadRequestException("Only the assigned expert can accept or decline this booking");
                }
                if (booking.getStatus() != BookingStatus.PENDING) {
                    throw new BadRequestException("Only PENDING bookings can be accepted or declined");
                }
            }
            case COMPLETED -> {
                // Only the customer may mark as completed
                if (!booking.getCustomer().getId().equals(actor.getId())) {
                    throw new BadRequestException("Only the customer can mark a booking as completed");
                }
                if (booking.getStatus() != BookingStatus.ACCEPTED) {
                    throw new BadRequestException("Only ACCEPTED bookings can be marked as completed");
                }
            }
            default -> throw new BadRequestException("Invalid target status: " + newStatus);
        }
    }

    public BookingResponseDTO toDTO(Booking booking) {
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
