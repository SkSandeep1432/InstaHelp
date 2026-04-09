package com.instahelp.config;

import com.instahelp.model.Category;
import com.instahelp.model.Role;
import com.instahelp.model.User;
import com.instahelp.repository.CategoryRepository;
import com.instahelp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Runs once on startup to seed the database with:
 *  - A default admin account
 *  - Default service categories
 *
 * Admin credentials:
 *   Email:    admin@instahelp.com
 *   Password: Admin@123
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        seedAdmin();
        seedCategories();
    }

    private void seedAdmin() {
        String adminEmail = "admin@instahelp.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .name("Administrator")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("✅ Default admin created — email: {}, password: Admin@123", adminEmail);
        }
    }

    private void seedCategories() {
        List<Category> defaults = List.of(
            Category.builder().name("Electrician")   .description("Electrical installation, wiring, repairs, and safety inspections").build(),
            Category.builder().name("Plumber")       .description("Pipe fitting, leak repairs, drainage, and water system installation").build(),
            Category.builder().name("Carpenter")     .description("Furniture making, wood repairs, cabinets, and custom woodwork").build(),
            Category.builder().name("Painter")       .description("Interior and exterior painting, wall finishing, and decorating").build(),
            Category.builder().name("Gardener")      .description("Lawn care, landscaping, pruning, and garden maintenance").build(),
            Category.builder().name("Home Cleaner")  .description("Deep cleaning, regular housekeeping, and post-construction cleaning").build(),
            Category.builder().name("Tutor")         .description("Academic tutoring, test preparation, and subject mentoring").build(),
            Category.builder().name("IT Support")    .description("Computer repair, networking, software setup, and tech troubleshooting").build(),
            Category.builder().name("Photographer")  .description("Portrait, event, product, and real estate photography").build(),
            Category.builder().name("AC Technician") .description("Air conditioner installation, servicing, gas refill, and repairs").build(),
            Category.builder().name("Mason")         .description("Brickwork, plastering, tiling, and concrete construction").build(),
            Category.builder().name("Driver")        .description("Personal driver, delivery, and chauffeur services").build()
        );

        for (Category cat : defaults) {
            if (!categoryRepository.existsByName(cat.getName())) {
                categoryRepository.save(cat);
                log.info("✅ Category seeded: {}", cat.getName());
            }
        }
    }
}
