package com.instahelp.repository;

import com.instahelp.model.Booking;
import com.instahelp.model.Review;
import com.instahelp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByBooking(Booking booking);
    List<Review> findByExpert(User expert);
    boolean existsByBooking(Booking booking);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.expert.id = :expertId")
    Double findAverageRatingByExpertId(Long expertId);

    long countByExpert(User expert);
}
