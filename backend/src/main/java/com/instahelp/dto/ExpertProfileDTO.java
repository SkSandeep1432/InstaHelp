package com.instahelp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpertProfileDTO {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String status;
    private Long categoryId;
    private String categoryName;
    private String workDescription;
    private String skills;
    private boolean availability;
    private Double averageRating;
    private int totalReviews;
    private String rejectionReason;
}
