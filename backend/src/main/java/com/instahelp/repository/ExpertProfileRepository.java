package com.instahelp.repository;

import com.instahelp.model.ExpertProfile;
import com.instahelp.model.ExpertStatus;
import com.instahelp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpertProfileRepository extends JpaRepository<ExpertProfile, Long> {
    Optional<ExpertProfile> findByUser(User user);
    Optional<ExpertProfile> findByUserId(Long userId);
    List<ExpertProfile> findByStatus(ExpertStatus status);
    List<ExpertProfile> findByCategoryId(Long categoryId);
    long countByStatus(ExpertStatus status);
}
