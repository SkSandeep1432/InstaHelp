package com.instahelp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingDTO {

    @NotNull(message = "Expert ID is required")
    private Long expertId;

    private String requirementNote;

    private LocalDateTime scheduledDate;
}
