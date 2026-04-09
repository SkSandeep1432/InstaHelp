package com.instahelp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private Long expertId;
    private String expertName;
    private String expertEmail;
    private String requirementNote;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime scheduledDate;
}
