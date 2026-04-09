package com.instahelp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    // Used by unified /register endpoint to dispatch to expert or customer flow
    private String role;

    // Expert-specific optional fields
    private Long categoryId;
    private String workDescription;
    private String skills;
}
