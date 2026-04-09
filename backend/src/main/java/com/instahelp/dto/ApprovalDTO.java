package com.instahelp.dto;

import lombok.Data;

@Data
public class ApprovalDTO {
    // Used for reject endpoint — carries the optional rejection reason
    private String reason;
}
