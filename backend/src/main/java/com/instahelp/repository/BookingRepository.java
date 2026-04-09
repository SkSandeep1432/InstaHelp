package com.instahelp.repository;

import com.instahelp.model.Booking;
import com.instahelp.model.BookingStatus;
import com.instahelp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer(User customer);
    List<Booking> findByExpert(User expert);
    List<Booking> findByCustomerOrderByCreatedAtDesc(User customer);
    List<Booking> findByExpertOrderByCreatedAtDesc(User expert);
    long countByExpert(User expert);
    long countByExpertAndStatus(User expert, BookingStatus status);
    long countByCustomer(User customer);
    long countByCustomerAndStatus(User customer, BookingStatus status);
}
