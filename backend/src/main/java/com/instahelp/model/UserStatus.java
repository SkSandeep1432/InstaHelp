package com.instahelp.model;

/**
 * Status of an expert's registration approval.
 * Kept as UserStatus for backward compatibility with existing column mappings.
 */
public enum UserStatus {
    PENDING, APPROVED, REJECTED
}
