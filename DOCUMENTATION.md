# InstaHelp — Complete Project Documentation

> **Version:** 1.0.0 | **Stack:** Angular 17 + Spring Boot 3.4.0 + H2 / MySQL  
> **Last Updated:** April 2026

---

## Table of Contents

1. [What is InstaHelp?](#1-what-is-instahelp)
2. [How the App Works — Big Picture](#2-how-the-app-works--big-picture)
3. [Technology Stack (What Tools We Used)](#3-technology-stack-what-tools-we-used)
4. [Project Folder Structure](#4-project-folder-structure)
5. [Backend — Spring Boot (The Server Side)](#5-backend--spring-boot-the-server-side)
6. [Frontend — Angular 17 (The User Interface)](#6-frontend--angular-17-the-user-interface)
7. [User Roles & What Each Can Do](#7-user-roles--what-each-can-do)
8. [Database — How Data is Stored](#8-database--how-data-is-stored)
9. [Login & Security — How it Works](#9-login--security--how-it-works)
10. [Step-by-Step Workflows](#10-step-by-step-workflows)
11. [Demo Accounts (Ready to Use)](#11-demo-accounts-ready-to-use)
12. [How to Run the Application](#12-how-to-run-the-application)
13. [Environment Configuration](#13-environment-configuration)
14. [API Reference (All Endpoints)](#14-api-reference-all-endpoints)
15. [Bugs Found & Fixed](#15-bugs-found--fixed)

---

## 1. What is InstaHelp?

**InstaHelp** is like an online marketplace — similar to Uber or Fiverr — but for **local service experts**.

Think of it this way:
- **You need your house wired?** → Find an Electrician on InstaHelp.
- **Pipe is leaking?** → Book a Plumber.
- **Need homework help?** → Hire a Tutor.

```
┌─────────────────────────────────────────────────────────┐
│                       InstaHelp                          │
│                                                          │
│   "Connecting people who NEED help                       │
│    with people who CAN help"                             │
│                                                          │
│  ┌────────────┐    books    ┌────────────┐               │
│  │  CUSTOMER  │ ──────────► │   EXPERT   │               │
│  │            │             │            │               │
│  │ Needs help │             │ Provides   │               │
│  │ with home, │             │ services:  │               │
│  │ learning,  │             │ Electrical │               │
│  │ repairs... │             │ Plumbing   │               │
│  └────────────┘             │ Teaching   │               │
│                             │ IT Support │               │
│         ▲                   └────────────┘               │
│         │ oversees                ▲                       │
│  ┌──────┴─────┐                  │ approves              │
│  │   ADMIN    │──────────────────┘                       │
│  │            │                                          │
│  │ Controls   │                                          │
│  │ the whole  │                                          │
│  │ platform   │                                          │
│  └────────────┘                                          │
└─────────────────────────────────────────────────────────┘
```

### The 12 Service Categories Available

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ ⚡ Electrician│ 🔧 Plumber   │ 🪵 Carpenter │ 🎨 Painter   │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ 🌿 Gardener  │ 🧹 Cleaner   │ 📚 Tutor     │ 💻 IT Support│
├──────────────┼──────────────┼──────────────┼──────────────┤
│ 📷 Photographer│❄️ AC Tech  │ 🧱 Mason     │ 🚗 Driver    │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 2. How the App Works — Big Picture

### The Architecture (Simple Explanation)

Think of it like a restaurant:
- **Frontend (Angular)** = The dining room. This is what the user sees and clicks on.
- **Backend (Spring Boot)** = The kitchen. This does all the real work behind the scenes.
- **Database (H2/MySQL)** = The storage room. This is where all data is saved.
- **JWT Token** = Your wristband at an event. Once you log in, you get a wristband (token) that proves who you are for every request.

```
┌─────────────────────────────────────────────────────────────┐
│                  YOUR BROWSER (Frontend)                     │
│                   Angular 17 — Port 4200                     │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │  LOGIN   │  │  ADMIN   │  │  EXPERT  │  │  CUSTOMER  │  │
│  │  PAGES   │  │  PAGES   │  │  PAGES   │  │   PAGES    │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
│                                                              │
│         [Every click sends a request to the server]         │
└──────────────────────┬──────────────────────────────────────┘
                       │
             HTTP Requests (JSON)
             + JWT Token in header
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              SERVER (Backend) — Spring Boot                  │
│                        Port 8081                             │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │    SECURITY GATE (Spring Security + JWT)               │ │
│  │    "Who are you? What are you allowed to do?"          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌───────────┐  ┌───────────┐  ┌──────────┐  ┌──────────┐  │
│  │  /auth    │  │  /admin   │  │  /user   │  │/customer │  │
│  │ (login,   │  │ (manage   │  │ (expert  │  │(browse & │  │
│  │ register) │  │ platform) │  │ bookings)│  │ bookings)│  │
│  └───────────┘  └───────────┘  └──────────┘  └──────────┘  │
│                                                              │
│  [Server processes the request and talks to the database]   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                    SQL queries
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    DATABASE                                  │
│              H2 (development) / MySQL (production)           │
│                                                              │
│  ┌─────────┐  ┌────────────────┐  ┌──────────┐  ┌────────┐  │
│  │  users  │  │ expert_profiles│  │ bookings │  │reviews │  │
│  └─────────┘  └────────────────┘  └──────────┘  └────────┘  │
│                    ┌────────────┐                            │
│                    │ categories │                            │
│                    └────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow — What Happens When You Click "Book Now"

```
  USER clicks "Book Now" button
          │
          ▼
  Angular collects form data
  (requirement note + date)
          │
          ▼
  JWT Interceptor adds your token:
  "Authorization: Bearer eyJhbGci..."
          │
          ▼
  POST request sent to:
  http://localhost:8081/api/customer/bookings
          │
          ▼
  Spring Security checks:
  ✓ Is the token valid?
  ✓ Is the user a CUSTOMER?
          │
          ▼
  CustomerController receives request
          │
          ▼
  CustomerService saves booking to DB
  (status = PENDING)
          │
          ▼
  Response: { id: 1, status: "PENDING" }
          │
          ▼
  Angular shows: "Booking submitted!"
  Redirects to My Bookings page
```

---

## 3. Technology Stack (What Tools We Used)

### Backend Tools

| Tool | What It Is | Why We Use It |
|------|-----------|---------------|
| **Java 21** | The programming language | Runs the server code |
| **Spring Boot 3.4.0** | A Java framework | Makes it easy to build web APIs. Like a blueprint for your server. |
| **Spring Security** | Security library | Handles login, passwords, and who can access what |
| **Spring Data JPA** | Database helper library | Lets you talk to the database using Java objects instead of raw SQL |
| **Hibernate** | Database translator | Converts Java objects ↔ database rows automatically |
| **JJWT 0.11.5** | Token library | Creates and reads JWT login tokens |
| **H2 Database** | Lightweight database | Lives in memory (RAM). Great for development — no setup needed. Resets when server restarts. |
| **MySQL** | Full database | Used in production. Data stays permanently. |
| **Lombok** | Code helper | Automatically generates repetitive code (getters, setters, constructors) |
| **Maven** | Build tool | Downloads libraries and builds the project |

### Frontend Tools

| Tool | What It Is | Why We Use It |
|------|-----------|---------------|
| **Angular 17** | JavaScript framework | Builds the interactive web pages users see |
| **TypeScript** | Enhanced JavaScript | Like JavaScript but with type safety — catches bugs earlier |
| **RxJS** | Reactive library | Handles asynchronous operations (waiting for server responses) |
| **Bootstrap 5** | CSS framework | Pre-built styling — buttons, cards, grids, etc. |
| **Bootstrap Icons** | Icon library | 1000+ icons like calendar, person, check, etc. |
| **Angular Router** | Navigation | Changes pages without reloading the browser |
| **Angular Forms** | Form handling | Manages form inputs and validation |
| **HttpClient** | HTTP library | Sends requests to the backend server |

---

## 4. Project Folder Structure

```
IH/                                      ← Root project folder
│
├── backend/                             ← The SERVER (Spring Boot)
│   ├── pom.xml                          ← List of libraries (like package.json for Java)
│   └── src/main/
│       ├── java/com/instahelp/
│       │   │
│       │   ├── InstaHelpApplication.java    ← Main entry point (starts the server)
│       │   │
│       │   ├── config/                      ← Setup/configuration files
│       │   │   ├── DataInitializer.java     ← Seeds admin user + 12 categories on startup
│       │   │   ├── JwtAuthFilter.java       ← Checks JWT token on every request
│       │   │   ├── JwtUtil.java             ← Creates and reads JWT tokens
│       │   │   └── SecurityConfig.java      ← Defines who can access what routes
│       │   │
│       │   ├── controller/                  ← Handles incoming HTTP requests
│       │   │   ├── AuthController.java      ← /api/auth/** (login, register)
│       │   │   ├── AdminController.java     ← /api/admin/** (admin actions)
│       │   │   ├── UserController.java      ← /api/user/** (expert actions)
│       │   │   ├── CustomerController.java  ← /api/customer/** (customer actions)
│       │   │   └── PublicController.java    ← /api/public/** (no login required)
│       │   │
│       │   ├── dto/                         ← Data Transfer Objects (what goes in/out)
│       │   │   ├── LoginRequestDTO.java     ← { email, password }
│       │   │   ├── LoginResponseDTO.java    ← { token, role, name, email }
│       │   │   ├── RegisterRequestDTO.java  ← Registration form data
│       │   │   ├── ExpertProfileDTO.java    ← Expert profile data
│       │   │   ├── BookingDTO.java          ← New booking request
│       │   │   ├── BookingResponseDTO.java  ← Booking details in response
│       │   │   ├── CategoryDTO.java         ← { name, description }
│       │   │   ├── ReviewDTO.java           ← { bookingId, rating, comment }
│       │   │   ├── ReviewResponseDTO.java   ← Review with customer name
│       │   │   └── ApprovalDTO.java         ← { reason } for rejection
│       │   │
│       │   ├── exception/                   ← Error handling
│       │   │   ├── GlobalExceptionHandler.java  ← Catches all errors, returns JSON
│       │   │   ├── BadRequestException.java     ← 400 errors (bad input)
│       │   │   └── ResourceNotFoundException.java ← 404 errors (not found)
│       │   │
│       │   ├── model/                       ← Database table definitions
│       │   │   ├── User.java                ← users table
│       │   │   ├── Role.java                ← ADMIN | EXPERT | CUSTOMER
│       │   │   ├── UserStatus.java          ← ACTIVE | INACTIVE
│       │   │   ├── ExpertProfile.java       ← expert_profiles table
│       │   │   ├── ExpertStatus.java        ← PENDING | APPROVED | REJECTED
│       │   │   ├── Booking.java             ← bookings table
│       │   │   ├── BookingStatus.java       ← PENDING | ACCEPTED | DECLINED | COMPLETED
│       │   │   ├── Category.java            ← categories table
│       │   │   └── Review.java              ← reviews table
│       │   │
│       │   ├── repository/                  ← Database query interfaces
│       │   │   ├── UserRepository.java
│       │   │   ├── ExpertProfileRepository.java
│       │   │   ├── BookingRepository.java
│       │   │   ├── CategoryRepository.java
│       │   │   └── ReviewRepository.java
│       │   │
│       │   └── service/                     ← Business logic (the real work)
│       │       ├── AuthService.java         ← Register and login logic
│       │       ├── AdminService.java        ← Admin operations
│       │       ├── UserService.java         ← Expert operations
│       │       ├── CustomerService.java     ← Customer operations
│       │       └── BookingService.java      ← Booking status changes
│       │
│       └── resources/
│           └── application.properties      ← Server settings (port, DB, JWT secret)
│
└── frontend/                            ← The USER INTERFACE (Angular)
    ├── package.json                     ← List of npm libraries
    ├── angular.json                     ← Angular project settings
    └── src/
        ├── index.html                   ← The one HTML page (SPA)
        ├── main.ts                      ← Angular bootstrap entry point
        ├── styles.scss                  ← Global CSS styles
        ├── environments/
        │   ├── environment.ts           ← Dev settings (API URL = localhost:8081)
        │   └── environment.prod.ts      ← Prod settings
        └── app/
            ├── app.config.ts            ← App-level providers (HTTP, Router, etc.)
            ├── app.routes.ts            ← URL → Component mapping
            ├── core/                    ← Shared services, guards, models
            │   ├── guards/
            │   │   ├── auth.guard.ts    ← Blocks non-logged-in users
            │   │   └── role.guard.ts    ← Blocks wrong roles
            │   ├── interceptors/
            │   │   └── jwt.interceptor.ts ← Auto-adds JWT to all requests
            │   ├── models/
            │   │   ├── user.model.ts    ← TypeScript interfaces for user data
            │   │   └── booking.model.ts ← TypeScript interfaces for bookings
            │   └── services/
            │       ├── auth.service.ts  ← Login/logout/token storage
            │       └── api.service.ts   ← HTTP request wrapper
            └── modules/
                ├── auth/
                │   ├── login/           ← Login page
                │   └── register/        ← Registration page (Customer + Expert tabs)
                ├── admin/
                │   ├── dashboard/       ← Admin stats overview
                │   ├── user-approvals/  ← Approve/reject experts
                │   ├── bookings/        ← View all platform bookings
                │   └── categories/      ← Manage service categories
                ├── user/                ← Expert pages
                │   ├── dashboard/       ← Expert stats overview
                │   ├── profile/         ← Edit expert profile
                │   └── my-bookings/     ← Manage incoming bookings
                └── customer/
                    ├── home/            ← Landing page with expert search
                    ├── expert-list/     ← Browse all experts
                    ├── expert-detail/   ← Single expert profile + reviews
                    ├── book-expert/     ← Booking form
                    └── my-bookings/     ← Customer's booking history + reviews
```

---

## 5. Backend — Spring Boot (The Server Side)

### 5.1 Configuration (`application.properties`)

This file controls all the server settings. Think of it as the control panel.

```properties
# ── DATABASE ──────────────────────────────────────────────
# H2 = a lightweight database that lives in memory (RAM).
# Perfect for development — no installation needed!
# ⚠️ All data resets when the server restarts.
spring.datasource.url=jdbc:h2:mem:instahelp_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console   # Visit http://localhost:8081/h2-console to see the DB

# create-drop = Create tables when server starts, drop them when it stops
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false

# ── SECURITY ──────────────────────────────────────────────
# The secret key used to sign JWT tokens (like a stamp of authenticity)
# Must be at least 32 characters for HMAC-SHA256
jwt.secret=instahelp_secret_key_2024_very_long_string_for_hmac_sha256_min32bytes
jwt.expiration=86400000   # 86400000 ms = 24 hours = how long the login token lasts

# ── SERVER ────────────────────────────────────────────────
server.port=8081                                    # Backend runs on port 8081
spring.web.cors.allowed-origins=http://localhost:4200  # Allow frontend to call backend

# ── INTELLIJ FIX ──────────────────────────────────────────
# DevTools was causing "port already in use" error in IntelliJ.
# Disabled here as a safety measure (devtools removed from pom.xml too).
spring.devtools.restart.enabled=false
spring.devtools.livereload.enabled=false
```

### What `DataInitializer.java` Does

When the server starts, this class automatically creates:

```
On Server Start:
├── Admin Account Created:
│     email:    admin@instahelp.com
│     password: Admin@123 (stored as BCrypt hash in DB)
│     role:     ADMIN
│
└── 12 Categories Created:
      1. Electrician    2. Plumber        3. Carpenter
      4. Painter        5. Gardener       6. Home Cleaner
      7. Tutor          8. IT Support     9. Photographer
     10. AC Technician 11. Mason         12. Driver
```

---

### 5.2 Security & JWT (How Login Protection Works)

#### What is JWT? (Simple Explanation)

JWT = **JSON Web Token**. Think of it like a **ticket at a theme park**:

```
┌──────────────────────────────────────────────────────────────┐
│  ANALOGY: Theme Park Wristband                               │
│                                                              │
│  1. You arrive at the gate and show your ID (email+password) │
│  2. Staff verify it and give you a WRISTBAND (JWT token)     │
│  3. At every ride (API endpoint), you show your wristband    │
│  4. Staff can check the wristband to see:                    │
│     - Who you are (email)                                    │
│     - What rides you're allowed on (role: ADMIN/EXPERT/CUSTOMER)│
│     - Whether it's still valid (expires in 24 hours)         │
│  5. You DON'T need to show your ID again for every ride      │
└──────────────────────────────────────────────────────────────┘
```

#### What Does a JWT Look Like?

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBpbnN0YWhlbHAuY29tIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzQ0MjI5NjAwfQ.abc123signature

  HEADER           PAYLOAD (your data)       SIGNATURE
  (algorithm)      (email + role + expiry)   (tamper-proof seal)
     │                    │                       │
     ▼                    ▼                       ▼
 eyJhbGci...    eyJzdWIiOiJhZG1p...    .abc123signature
```

#### Security Route Rules

```
ROUTE                   | WHO CAN ACCESS?
────────────────────────┼──────────────────────────────
/api/auth/**            | EVERYONE (no login needed)
/api/public/**          | EVERYONE (no login needed)
/api/admin/**           | ADMIN role only
/api/user/**            | EXPERT role only
/api/customer/**        | CUSTOMER role only
/h2-console             | Everyone (dev only)
```

#### How BCrypt Password Storage Works

```
When you register with password "Alice@123":

  "Alice@123"  ──────►  BCrypt Hash  ──────►  "$2a$10$xK9..."
                         (one-way)             (stored in DB)

When you login:
  You type "Alice@123"
  System runs BCrypt on it
  Compares result with stored hash
  ✓ Match = login allowed
  ✗ No match = login denied

⚠️ The original password is NEVER stored — not even the admin can see it.
```

---

### 5.3 Data Models (Database Tables Explained)

Think of each model as a spreadsheet table. Each field is a column.

#### `User` Table — Everyone who has an account

```
┌────┬──────────────┬───────────────────────┬──────────────┬──────────┬──────────┬─────────────────────┐
│ id │ name         │ email                 │ password     │ role     │ status   │ created_at          │
├────┼──────────────┼───────────────────────┼──────────────┼──────────┼──────────┼─────────────────────┤
│ 1  │ Administrator│ admin@instahelp.com   │ $2a$10$xK9.. │ ADMIN    │ ACTIVE   │ 2026-04-09 10:00:00 │
│ 2  │ Alice Smith  │ alice@example.com     │ $2a$10$yJ8.. │ EXPERT   │ ACTIVE   │ 2026-04-09 11:00:00 │
│ 3  │ John Doe     │ john@example.com      │ $2a$10$zL7.. │ CUSTOMER │ ACTIVE   │ 2026-04-09 12:00:00 │
└────┴──────────────┴───────────────────────┴──────────────┴──────────┴──────────┴─────────────────────┘
```

#### `ExpertProfile` Table — Extra info for EXPERT users

```
┌────┬─────────┬─────────────┬──────────────────────┬───────────────┬──────────┬──────────┐
│ id │ user_id │ category_id │ work_description     │ skills        │ status   │ availble │
├────┼─────────┼─────────────┼──────────────────────┼───────────────┼──────────┼──────────┤
│ 1  │ 2       │ 1           │ "8 years electrician"│ "Wiring, LED" │ APPROVED │ true     │
└────┴─────────┴─────────────┴──────────────────────┴───────────────┴──────────┴──────────┘
  Note: user_id=2 links to Alice Smith in the users table (One-to-One relationship)
```

#### `Booking` Table — Every booking ever made

```
┌────┬─────────────┬──────────┬──────────────────────────────┬────────────────────┬──────────┐
│ id │ customer_id │ expert_id│ requirement_note             │ scheduled_date     │ status   │
├────┼─────────────┼──────────┼──────────────────────────────┼────────────────────┼──────────┤
│ 1  │ 3           │ 2        │ "Need help with home wiring" │ 2026-04-20 00:00:00│ COMPLETED│
│ 2  │ 3           │ 2        │ "Fix my circuit breaker"     │ null               │ PENDING  │
└────┴─────────────┴──────────┴──────────────────────────────┴────────────────────┴──────────┘
```

#### `Review` Table — Customer ratings after completed bookings

```
┌────┬────────────┬─────────────┬──────────┬────────┬──────────────────────────┐
│ id │ booking_id │ customer_id │ expert_id│ rating │ comment                  │
├────┼────────────┼─────────────┼──────────┼────────┼──────────────────────────┤
│ 1  │ 1          │ 3           │ 2        │ 5      │ "Excellent work!"        │
└────┴────────────┴─────────────┴──────────┴────────┴──────────────────────────┘
  Note: booking_id is UNIQUE — you can only leave one review per booking
```

#### How Tables Relate to Each Other

```
users ──────────────── expert_profiles
  │  (one expert has       │
  │   one profile)         │
  │                        │
  │ ┌──────────────────────┤
  │ │                      │
  ▼ ▼              categories
bookings              (expert belongs
  │                   to one category)
  │
  ▼
reviews
(one review per completed booking)
```

---

### 5.4 Repositories (Database Query Classes)

Repositories are like **library card catalogues** — they let you find, save, and delete data.

Spring Data JPA does most of the work automatically. You just define the interface:

| Repository | What It Manages | Important Custom Queries |
|-----------|----------------|--------------------------|
| `UserRepository` | User accounts | `findByEmail()` — find user by email address |
| `ExpertProfileRepository` | Expert profiles | `findByStatus(PENDING)` — get all pending experts |
| `BookingRepository` | All bookings | `findByExpert()` — get bookings for a specific expert |
| `CategoryRepository` | Service categories | Standard save/find/delete only |
| `ReviewRepository` | Customer reviews | `findAverageRatingByExpertId()` — calculate star rating |

---

### 5.5 Services (The Business Logic)

Services contain the **rules of how the app works**. They sit between Controllers (who receive requests) and Repositories (who talk to the database).

```
HTTP Request
    │
    ▼
Controller      ← "Someone wants to accept a booking"
    │
    ▼
Service         ← "Is the booking PENDING? Is this the right expert?
    │              If yes, change status to ACCEPTED"
    │
    ▼
Repository      ← "Save the updated booking to the database"
    │
    ▼
HTTP Response   ← "Here is the updated booking data"
```

#### `AuthService` — Registration and Login

```
registerExpert()
  ├── Create User (role = EXPERT, status = ACTIVE)
  └── Create ExpertProfile (status = PENDING)
       └── Expert cannot login yet — needs admin approval

registerCustomer()
  └── Create User (role = CUSTOMER)
       └── Customer can login immediately

login()
  ├── Find user by email
  ├── Check password matches BCrypt hash
  ├── If EXPERT → check ExpertProfile.status == APPROVED
  │    └── If PENDING or REJECTED → throw error "pending approval"
  └── Generate JWT token with email + role
```

#### `AdminService` — Platform Management

```
getPendingExperts()   → Find all ExpertProfiles with status = PENDING
approveExpert(id)     → Set ExpertProfile.status = APPROVED
rejectExpert(id)      → Set ExpertProfile.status = REJECTED + save reason
getAllBookings()       → Return every booking on the platform
getDashboardStats()   → Count: total experts, pending, customers, all bookings
createCategory()      → Add new service category
deleteCategory()      → Remove a service category
```

#### `UserService` — Expert Actions

```
getProfile()          → Load expert's profile with rating data
updateProfile()       → Save changes to profile (description, skills, etc.)
getMyBookings()       → Get all bookings where this expert is the provider
acceptBooking()       → Change booking PENDING → ACCEPTED
declineBooking()      → Change booking PENDING → DECLINED
completeBooking()     → Change booking ACCEPTED → COMPLETED
getDashboardStats()   → Count bookings by status for this expert
```

#### `CustomerService` — Customer Actions

```
getApprovedExperts()  → Find all experts with status=APPROVED and available=true
getExpertById()       → Load one expert's full profile
getExpertReviews()    → Load all reviews for a specific expert
createBooking()       → Save new booking (status = PENDING)
getMyBookings()       → Get all bookings made by this customer
submitReview()        → Save a review for a completed booking
getDashboardStats()   → Count customer's bookings by status
```

---

### 5.6 REST API Endpoints (All URLs the App Uses)

#### Understanding REST Verbs

```
GET    = Read data     (like opening a file)
POST   = Create new    (like writing a new file)
PUT    = Update        (like editing a file)
DELETE = Remove        (like deleting a file)
```

#### Public Endpoints — No Login Required

```
POST   /api/auth/register          Register a new account (expert or customer)
POST   /api/auth/login             Login and get your JWT token
GET    /api/public/categories      List all 12 service categories
```

#### Admin Endpoints — Requires Admin Login

```
GET    /api/admin/dashboard/stats          Get platform stats
GET    /api/admin/experts/pending          List experts waiting for approval
PUT    /api/admin/experts/{id}/approve     Approve an expert
PUT    /api/admin/experts/{id}/reject      Reject an expert (send reason in body)
GET    /api/admin/bookings                 See ALL bookings on the platform
GET    /api/admin/categories               List all categories
POST   /api/admin/categories               Create a new category
DELETE /api/admin/categories/{id}          Delete a category
```

#### Expert Endpoints — Requires Expert Login (after approval)

```
GET    /api/user/profile                   See your own profile
PUT    /api/user/profile                   Update your profile
GET    /api/user/bookings                  See bookings customers made with you
PUT    /api/user/bookings/{id}/accept      Accept a pending booking
PUT    /api/user/bookings/{id}/decline     Decline a pending booking
PUT    /api/user/bookings/{id}/complete    Mark an accepted booking as done
GET    /api/user/dashboard/stats           See your booking statistics
```

#### Customer Endpoints — Requires Customer Login

```
GET    /api/customer/experts               Browse all approved experts
GET    /api/customer/experts/{id}          View one expert's full profile
GET    /api/customer/experts/{id}/reviews  See reviews for an expert
POST   /api/customer/bookings              Book an expert
GET    /api/customer/bookings              See your booking history
POST   /api/customer/reviews              Leave a review for a completed booking
GET    /api/customer/dashboard/stats       See your booking statistics
```

#### Dev-Only

```
GET    /h2-console     Web UI to view the H2 database directly
                       JDBC URL: jdbc:h2:mem:instahelp_db
                       Username: sa  |  Password: (blank)
```

---

### 5.7 DTOs — What Goes In and Out of the API

DTOs (Data Transfer Objects) define exactly what data the API sends and receives. They protect the database models from being exposed directly.

```
                    ┌─────────────────────┐
                    │   REQUEST DTOs      │
                    │  (data coming IN)   │
                    └─────────────────────┘

LoginRequestDTO         { email, password }
RegisterRequestDTO      { name, email, password, role,
                          categoryId, workDescription, skills,
                          experienceYears, location }
BookingDTO              { expertId, requirementNote, scheduledDate }
ReviewDTO               { bookingId, rating (1-5), comment }
CategoryDTO             { name, description }
ApprovalDTO             { reason }   ← for rejection only

                    ┌─────────────────────┐
                    │   RESPONSE DTOs     │
                    │  (data going OUT)   │
                    └─────────────────────┘

LoginResponseDTO        { token, role, name, email }
ExpertProfileDTO        { id, userId, name, email, status,
                          categoryId, categoryName, workDescription,
                          skills, availability, rejectionReason,
                          averageRating, totalReviews,
                          experienceYears, location }
BookingResponseDTO      { id, customerId, customerName, customerEmail,
                          expertId, expertName, expertEmail,
                          requirementNote, status,
                          createdAt, scheduledDate }
ReviewResponseDTO       { id, bookingId, customerName,
                          rating, comment, createdAt }
```

---

### 5.8 Error Handling

When something goes wrong, the app always returns a consistent JSON error instead of a confusing Java error page.

```
ERROR RESPONSES — Always in this format:
{
  "message": "A clear description of what went wrong",
  "timestamp": "2026-04-09T17:00:00.000"
}

Error Types:
┌─────────────────────────────┬──────┬──────────────────────────────────────┐
│ Situation                   │ Code │ Example Message                      │
├─────────────────────────────┼──────┼──────────────────────────────────────┤
│ Resource not found in DB    │ 404  │ "Booking not found with id: 99"      │
│ Business rule violated      │ 400  │ "Expert account is pending approval" │
│ Form validation failed      │ 400  │ "Email must not be blank"            │
│ Unexpected server error     │ 500  │ "Internal server error"              │
└─────────────────────────────┴──────┴──────────────────────────────────────┘
```

---

## 6. Frontend — Angular 17 (The User Interface)

### How Angular Works (Simple Explanation)

Angular is a **Single Page Application** framework. This means:
- The browser only loads ONE HTML page (`index.html`) ever
- When you navigate to a different page, Angular swaps out the content without a full reload
- This makes the app feel fast — like a mobile app

```
Traditional Website:            Angular SPA:
  Click link                      Click link
      │                               │
      ▼                               ▼
  Browser downloads              Angular Router handles it
  a whole new HTML page          locally — NO server request
      │                               │
      ▼                               ▼
  Page flashes/reloads           Instantly swaps content
                                 Page stays loaded ✓
```

### 6.1 App Configuration & Routing

#### Navigation Map — Which URL Goes Where

```
URL Path                       Page Component              Who Can Access?
─────────────────────────────────────────────────────────────────────────
/                           → redirects to /customer/home    Everyone
/login                      → LoginComponent                 Everyone
/register                   → RegisterComponent              Everyone
                                                             
/admin/dashboard            → AdminDashboardComponent        ADMIN only
/admin/user-approvals       → UserApprovalsComponent         ADMIN only
/admin/bookings             → AdminBookingsComponent         ADMIN only
/admin/categories           → CategoriesComponent           ADMIN only
                                                             
/user/dashboard             → UserDashboardComponent         EXPERT only
/user/profile               → UserProfileComponent          EXPERT only
/user/my-bookings           → UserMyBookingsComponent       EXPERT only
                                                             
/customer/home              → CustomerHomeComponent          Everyone
/customer/experts           → ExpertListComponent            Everyone
/customer/experts/:id       → ExpertDetailComponent          Everyone
/customer/book/:id          → BookExpertComponent            CUSTOMER only
/customer/my-bookings       → CustomerMyBookingsComponent    CUSTOMER only
                                                             
**                          → redirects to /customer/home    Everyone
```

#### How Route Guards Work

```
User tries to visit /admin/dashboard
          │
          ▼
    authGuard checks:
    "Is there a JWT token in localStorage?"
          │
    NO ───┴─── YES
     │               │
     ▼               ▼
  Redirect       roleGuard checks:
  to /login      "Is the role == ADMIN?"
                       │
                 NO ───┴─── YES
                  │               │
                  ▼               ▼
              Redirect        Allow access ✓
              to /customer/home  Show admin dashboard
```

---

### 6.2 Core Services

#### `AuthService` — Login State Manager

Stores your login info in the browser's `localStorage` (persists after page refresh):

```
After login, localStorage contains:
┌─────────────────────────────────────────────────────────┐
│  localStorage                                            │
│                                                          │
│  "token" → "eyJhbGciOiJIUzI1NiJ9..."  (your JWT token) │
│  "role"  → "CUSTOMER"                  (your role)      │
│  "name"  → "John Doe"                  (your name)      │
│  "email" → "john@example.com"          (your email)     │
└─────────────────────────────────────────────────────────┘

After logout:
└── All keys cleared from localStorage
```

Key methods:
```
isLoggedIn()   → checks if "token" key exists in localStorage
getRole()      → returns "ADMIN" | "EXPERT" | "CUSTOMER"
isAdmin()      → returns true if role is ADMIN
isExpert()     → returns true if role is EXPERT
isCustomer()   → returns true if role is CUSTOMER
logout()       → clears localStorage, redirects to /login
```

#### `ApiService` — HTTP Communication Helper

A simple wrapper that adds the base URL automatically:

```
You call:         apiService.get('/customer/experts')
It actually sends: GET http://localhost:8081/api/customer/experts

Methods:
  .get(path)         → GET  request
  .post(path, data)  → POST request
  .put(path, data)   → PUT  request
  .delete(path)      → DELETE request
```

#### `JWT Interceptor` — The Invisible Helper

Every time Angular makes an HTTP request, the interceptor silently adds your JWT:

```
BEFORE interceptor:
  GET /api/customer/experts
  (no token — server would reject with 401 Unauthorized)

AFTER interceptor automatically adds:
  GET /api/customer/experts
  Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
  (server accepts it ✓)
```

---

### 6.3 Auth Module (Login & Register Pages)

#### Login Page (`/login`)

```
┌─────────────────────────────────────────────────────────┐
│                     InstaHelp Login                      │
├─────────────────────────────────────────────────────────┤
│  Email:    [________________________]                    │
│  Password: [________] [👁 show/hide]                     │
│                                                          │
│  [       Sign In       ]                                 │
│                                                          │
│  ❌ "Expert account is pending admin approval"           │
│     (shown if expert tries to login before approval)     │
│                                                          │
│  Don't have an account? Register                         │
└─────────────────────────────────────────────────────────┘

After successful login:
  ADMIN    → /admin/dashboard
  EXPERT   → /user/dashboard
  CUSTOMER → /customer/home
```

#### Register Page (`/register`)

```
┌─────────────────────────────────────────────────────────┐
│                   Create Account                         │
├───────────────────────┬─────────────────────────────────┤
│  [ Customer Tab ]     │  [ Expert Tab ]                  │
├───────────────────────┴─────────────────────────────────┤
│  Name:     [_______________________]                     │
│  Email:    [_______________________]                     │
│  Password: [_______________________]                     │
│                                                          │
│  ── EXPERT ONLY (shown in Expert tab) ──                 │
│  Service Category: [Electrician ▼]                       │
│  About You:        [_____textarea_____]                  │
│  Skills:           [Wiring, LED, ...  ]                  │
│  Experience:       [8] years                             │
│  Location:         [Mumbai            ]                  │
│                                                          │
│  ℹ️ Expert accounts require admin approval               │
│                                                          │
│  [     Create Account     ]                              │
└─────────────────────────────────────────────────────────┘
```

---

### 6.4 Admin Module

#### Admin Dashboard (`/admin/dashboard`)

```
┌─────────────────────────────────────────────────────────┐
│  Admin Dashboard                                         │
├──────────────┬──────────────┬──────────────┬────────────┤
│  👥 Experts  │  ⏳ Pending  │  🛒 Customers│  📋 Total  │
│      12      │      3       │      45      │  Bookings  │
│              │              │              │    127     │
├──────────────┴──────────────┴──────────────┴────────────┤
│                                                          │
│  Quick Actions:                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │   ✅ Expert  │  │  📋 All      │  │  🏷️ Manage     │ │
│  │  Approvals   │  │  Bookings    │  │  Categories    │ │
│  │  3 pending   │  │              │  │                │ │
│  └──────────────┘  └──────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### User Approvals Page (`/admin/user-approvals`)

```
┌─────────────────────────────────────────────────────────┐
│  Expert Approvals                                        │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │  [A]  Alice Smith                ⏳ PENDING      │    │
│  │       alice@example.com                          │    │
│  │       Skills: [Wiring] [LED] [Panels]           │    │
│  │                                                  │    │
│  │  [✓ Approve]  [✗ Reject]                        │    │
│  │                                                  │    │
│  │  (If Reject is clicked, this appears:)          │    │
│  │  Reason: [__________________________]           │    │
│  │          [Confirm Rejection]                    │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ✅ "All caught up! No pending approvals."               │
│     (shown when queue is empty)                          │
└─────────────────────────────────────────────────────────┘
```

#### Admin Bookings Page (`/admin/bookings`)

```
┌─────────────────────────────────────────────────────────┐
│  All Platform Bookings                    [All Status ▼] │
│  Search: [___________________]                           │
├─────────────────────────────────────────────────────────┤
│  John Doe → Alice Smith (Electrician)     ✅ COMPLETED   │
│  "Need help with home wiring"                            │
│  Booked: Apr 9 | Scheduled: Apr 20                      │
├─────────────────────────────────────────────────────────┤
│  Bob Kumar → Raj Plumber                 ⏳ PENDING     │
│  "Fix leaking pipe under sink"                           │
│  Booked: Apr 10                                          │
└─────────────────────────────────────────────────────────┘
```

#### Categories Management (`/admin/categories`)

```
┌─────────────────────────────────────────────────────────┐
│  Manage Categories                                       │
├─────────────────────────────────────────────────────────┤
│  Add New Category:                                       │
│  Name:        [___________________________]              │
│  Description: [___________________________]              │
│  [+ Add Category]                                        │
├─────────────────────────────────────────────────────────┤
│  ⚡ Electrician     [🗑 Delete]                          │
│  🔧 Plumber         [🗑 Delete]                          │
│  🪵 Carpenter       [🗑 Delete]                          │
│  ... (12 total)                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 6.5 Expert (User) Module

#### Expert Dashboard (`/user/dashboard`)

```
┌─────────────────────────────────────────────────────────┐
│  Welcome back, Alice! 👋                                 │
│  Status: ✅ APPROVED                                     │
│  (or ⏳ PENDING APPROVAL / ❌ REJECTED: "reason here")   │
├──────────────┬──────────────┬──────────────┬────────────┤
│  📋 Total    │  ⏳ Pending  │  ✓ Accepted  │ ✅ Complete │
│      8       │      2       │      3       │     3      │
├──────────────┴──────────────┴──────────────┴────────────┤
│  Quick Actions:                                          │
│  ┌─────────────────────┐  ┌─────────────────────────┐   │
│  │  📋 Manage Bookings │  │  👤 Edit Profile        │   │
│  └─────────────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### Expert Profile (`/user/profile`)

```
┌─────────────────────────────────────────────────────────┐
│  My Profile                        ✅ APPROVED           │
├─────────────────────────────────────────────────────────┤
│  [A]  Alice Smith                                        │
│       alice@example.com                                  │
│       Skills: [Wiring] [LED] [Panel Upgrades]           │
│       ★ 4.8 (12 reviews)                                 │
├─────────────────────────────────────────────────────────┤
│  Edit Profile:                                           │
│  Display Name:    [Alice Smith              ]            │
│  About / Work:    [________________________]             │
│  Skills:          [Wiring, LED, Panels      ]            │
│  Category:        [Electrician ▼            ]            │
│  Available:       [✓ Toggle ON/OFF          ]            │
│                                                          │
│  [Save Changes]                                          │
└─────────────────────────────────────────────────────────┘
```

#### Expert My Bookings (`/user/my-bookings`)

```
┌─────────────────────────────────────────────────────────┐
│  My Bookings (as expert)                                 │
├─────────────────────────────────────────────────────────┤
│  ┌── PENDING booking ──────────────────────────────┐    │
│  │  [J]  John Doe                  ⏳ PENDING       │    │
│  │       john@example.com                           │    │
│  │  "Need wiring done for new room"                 │    │
│  │  Created: Apr 9 | Scheduled: Apr 20             │    │
│  │                              [✓ Accept] [✗ Decline]│ │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌── ACCEPTED booking ─────────────────────────────┐    │
│  │  [B]  Bob Kumar                 ✓ ACCEPTED       │    │
│  │  "Fix outdoor lights"                            │    │
│  │                              [✓ Mark Complete]   │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌── COMPLETED booking ────────────────────────────┐    │
│  │  [S]  Sara Singh               ✅ COMPLETED      │    │
│  │  "Install ceiling fan"                           │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

### 6.6 Customer Module

#### Customer Home (`/customer/home`)

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│   Find the Right Expert for Any Job                      │
│   Search: [_________________________] [🔍]              │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  [All] [Electrician] [Plumber] [Carpenter] [Tutor] ...  │
│        ← Category filter buttons                         │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ [A] Alice   │  │ [R] Raj     │  │ [P] Priya   │     │
│  │ Electrician │  │ Plumber     │  │ Tutor       │     │
│  │ ★ 4.8       │  │ ★ 4.5       │  │ ★ 5.0       │     │
│  │ [Wiring]    │  │ [Pipes]     │  │ [Math]      │     │
│  │ [View] [Book│  │ [View] [Book│  │ [View] [Book│     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

#### Expert Detail Page (`/customer/experts/:id`)

```
┌─────────────────────────────────────────────────────────┐
│  Home / Experts / Alice Smith                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [A]  Alice Smith                                        │
│       ⚡ Electrician                                     │
│       📍 Mumbai  |  💼 8 years experience  |  ★ 4.8 (12)│
│                               [📅 Book This Expert]     │
│                                                          │
│  Professional electrician with 8 years of experience    │
│  in residential and commercial wiring...                 │
│                                                          │
│  [Wiring] [LED Lighting] [Panel Upgrades] [Solar]       │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  ⭐ Reviews  (12)                                        │
├─────────────────────────────────────────────────────────┤
│  [J]  John Doe                              Apr 9, 2026  │
│       ★★★★★                                              │
│       "Excellent work, very professional!"               │
│  ─────────────────────────────────────────              │
│  [B]  Bob Kumar                             Apr 7, 2026  │
│       ★★★★☆                                              │
│       "Good job, arrived on time."                       │
└─────────────────────────────────────────────────────────┘
```

#### Book Expert Page (`/customer/book/:id`)

```
┌─────────────────────────────────────────────────────────┐
│  Book an Expert                          [← Back]        │
├─────────────────┬───────────────────────────────────────┤
│                 │  Booking Details                       │
│  [A] Alice Smith│                                        │
│  ⚡ Electrician │  What do you need help with? *         │
│  ★ 4.8          │  [__________________________________]  │
│  Mumbai         │  [__________________________________]  │
│  8 yrs exp      │  [__________________________________]  │
│  [Wiring][LED]  │                                        │
│                 │  Preferred Date (optional):            │
│                 │  [📅 2026-04-20]                       │
│                 │                                        │
│                 │  [📤 Confirm Booking Request]          │
│                 │                                        │
│                 │  ✅ "Booking submitted! Expert will    │
│                 │     respond soon." (after submit)      │
└─────────────────┴───────────────────────────────────────┘
```

#### Customer My Bookings (`/customer/my-bookings`)

```
┌─────────────────────────────────────────────────────────┐
│  My Bookings                                             │
├──────────────┬──────────────┬──────────────┬────────────┤
│  📋 Total    │  ⏳ Pending  │  ✓ Accepted  │ ✅ Complete │
│      5       │      1       │      2       │     2      │
├──────────────┴──────────────┴──────────────┴────────────┤
│                                                          │
│  ┌── COMPLETED booking ────────────────────────────┐    │
│  │  Expert: Alice Smith (Electrician)               │    │
│  │  "Home wiring for new room"          ✅ COMPLETED │    │
│  │  Booked: Apr 9 | Scheduled: Apr 20              │    │
│  │                                                  │    │
│  │  ── Leave a Review ──────────────────────────── │    │
│  │  Rating:  ★ ★ ★ ★ ★  (click stars)             │    │
│  │           Poor Fair Good VGood Excellent         │    │
│  │  Comment: [_________________________________]    │    │
│  │           [Submit Review]                        │    │
│  │                                                  │    │
│  │  (After submit: ✅ "Review submitted!" badge)    │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

### 6.7 Shared Components

#### Navbar (Changes Based on Who is Logged In)

```
NOT LOGGED IN:
┌──────────────────────────────────────────────────────┐
│  InstaHelp                          [Login] [Register]│
└──────────────────────────────────────────────────────┘

LOGGED IN AS ADMIN:
┌──────────────────────────────────────────────────────┐
│  InstaHelp  Dashboard  Approvals  Bookings  Categories│
│                                  [Administrator ADMIN]│
│                                  [Logout]             │
└──────────────────────────────────────────────────────┘

LOGGED IN AS EXPERT:
┌──────────────────────────────────────────────────────┐
│  InstaHelp  Dashboard  Profile  My Bookings           │
│                                  [Alice Smith EXPERT] │
│                                  [Logout]             │
└──────────────────────────────────────────────────────┘

LOGGED IN AS CUSTOMER:
┌──────────────────────────────────────────────────────┐
│  InstaHelp  Home  Find Experts  My Bookings           │
│                                  [John Doe CUSTOMER]  │
│                                  [Logout]             │
└──────────────────────────────────────────────────────┘
```

---

## 7. User Roles & What Each Can Do

```
┌─────────────────────────────────────────────────────────────┐
│                        ADMIN                                 │
│  The platform owner/manager                                  │
├─────────────────────────────────────────────────────────────┤
│  ✅ View platform stats (experts, customers, bookings count) │
│  ✅ See all pending expert registrations                     │
│  ✅ Approve or Reject experts (with reason)                  │
│  ✅ View ALL bookings across the entire platform             │
│  ✅ Create new service categories                            │
│  ✅ Delete service categories                                │
│  ❌ Cannot book services                                     │
│  ❌ Cannot register as an expert                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       EXPERT                                 │
│  Service providers (Electrician, Plumber, Tutor, etc.)      │
├─────────────────────────────────────────────────────────────┤
│  ✅ Register with full profile (category, skills, etc.)     │
│  ✅ Wait for admin approval before logging in               │
│  ✅ View and edit their own profile                          │
│  ✅ See incoming booking requests from customers             │
│  ✅ Accept or Decline PENDING bookings                       │
│  ✅ Mark ACCEPTED bookings as COMPLETED                      │
│  ✅ View booking stats on dashboard                          │
│  ❌ Cannot book other experts                                │
│  ❌ Cannot access admin features                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      CUSTOMER                                │
│  People who need services                                    │
├─────────────────────────────────────────────────────────────┤
│  ✅ Register immediately (no approval needed)                │
│  ✅ Browse all approved experts                              │
│  ✅ Filter experts by category (Electrician, Tutor, etc.)   │
│  ✅ View any expert's full profile and reviews               │
│  ✅ Book an expert (with requirement note + preferred date)  │
│  ✅ View their own booking history                           │
│  ✅ Leave star rating + comment for COMPLETED bookings       │
│  ❌ Cannot approve/reject experts                            │
│  ❌ Cannot see other customers' bookings                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Database — How Data is Stored

### Table Relationships (Visual)

```
users (id, name, email, password, role, status)
  │
  ├──────────────────────────────────────────────┐
  │  (one EXPERT user has one profile)           │
  ▼                                              │
expert_profiles (id, user_id→users, category_id→categories,
                 work_description, skills, status)
                          │
                          │ (many experts can be in one category)
                          ▼
                    categories (id, name, description)

users
  │
  ├─────────────────────────────────────────────────┐
  │  (as customer — MANY bookings)                  │
  │  (as expert  — MANY bookings)                   │
  ▼                                                 │
bookings (id, customer_id→users, expert_id→users,    │
          requirement_note, scheduled_date, status)  │
  │                                                  │
  │  (one completed booking → one review)            │
  ▼
reviews (id, booking_id→bookings, customer_id→users,
         expert_id→users, rating, comment)
```

### SQL Schema

```sql
-- USERS: stores everyone with an account
CREATE TABLE users (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) UNIQUE NOT NULL,     -- must be unique
    password   VARCHAR(255) NOT NULL,            -- BCrypt hash, never plain text
    role       VARCHAR(20)  NOT NULL,            -- ADMIN | EXPERT | CUSTOMER
    status     VARCHAR(20)  NOT NULL,            -- ACTIVE | INACTIVE
    created_at TIMESTAMP DEFAULT NOW()
);

-- CATEGORIES: the 12 service types
CREATE TABLE categories (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(500)
);

-- EXPERT_PROFILES: extra info for EXPERT users
CREATE TABLE expert_profiles (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT UNIQUE NOT NULL REFERENCES users(id),
    category_id       BIGINT REFERENCES categories(id),
    work_description  TEXT,
    skills            VARCHAR(500),              -- "Wiring, LED, Panels"
    availability      BOOLEAN DEFAULT TRUE,
    status            VARCHAR(20) NOT NULL,      -- PENDING | APPROVED | REJECTED
    rejection_reason  VARCHAR(500),              -- only set if REJECTED
    created_at        TIMESTAMP DEFAULT NOW()
);

-- BOOKINGS: customer requests to experts
CREATE TABLE bookings (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id      BIGINT NOT NULL REFERENCES users(id),
    expert_id        BIGINT NOT NULL REFERENCES users(id),
    requirement_note TEXT,
    scheduled_date   TIMESTAMP,                  -- optional preferred date
    status           VARCHAR(20) NOT NULL,       -- PENDING|ACCEPTED|DECLINED|COMPLETED
    created_at       TIMESTAMP DEFAULT NOW()
);

-- REVIEWS: ratings after completed bookings
CREATE TABLE reviews (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id  BIGINT UNIQUE NOT NULL REFERENCES bookings(id),  -- one review per booking
    customer_id BIGINT NOT NULL REFERENCES users(id),
    expert_id   BIGINT NOT NULL REFERENCES users(id),
    rating      INT    NOT NULL CHECK (rating BETWEEN 1 AND 5),  -- 1 to 5 stars
    comment     TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

---

## 9. Login & Security — How it Works

### Step-by-Step Login Flow

```
STEP 1: User types email + password on /login page
            │
            ▼
STEP 2: Angular sends POST /api/auth/login
        Body: { "email": "alice@example.com", "password": "Alice@123" }
            │
            ▼
STEP 3: Server looks up user by email in database
            │
            ├── Not found? → Error: "Invalid email or password"
            │
            ├── Wrong password? → Error: "Invalid email or password"
            │                    (BCrypt comparison fails)
            │
            └── Correct password?
                    │
                    ├── Is this an EXPERT?
                    │       │
                    │       ├── ExpertProfile.status = PENDING?
                    │       │       └── Error: "Account pending approval"
                    │       │
                    │       ├── ExpertProfile.status = REJECTED?
                    │       │       └── Error: "Account was rejected"
                    │       │
                    │       └── ExpertProfile.status = APPROVED? ✓ continue
                    │
                    └── ADMIN or CUSTOMER? ✓ always continue
            │
            ▼
STEP 4: Server creates JWT token:
        Header:  { "alg": "HS256" }
        Payload: { "sub": "alice@example.com", "role": "EXPERT", "exp": 1744229600 }
        Signed with: jwt.secret from application.properties
            │
            ▼
STEP 5: Server returns:
        { "token": "eyJhbGci...", "role": "EXPERT", "name": "Alice Smith", "email": "alice@..." }
            │
            ▼
STEP 6: Angular stores in localStorage and redirects based on role
            │
            ▼
STEP 7: On every future request, JWT interceptor adds token automatically
            │
            ▼
STEP 8: Server's JwtAuthFilter reads token on every request:
        - Extracts email from token
        - Verifies signature hasn't been tampered with
        - Checks token hasn't expired (24 hour limit)
        - Sets Spring Security context (so Spring knows who you are)
            │
            ▼
STEP 9: Spring Security checks if your role matches the route
        /api/user/** requires EXPERT role
        /api/admin/** requires ADMIN role
        /api/customer/** requires CUSTOMER role
```

---

## 10. Step-by-Step Workflows

### Workflow 1: Expert Registration & Approval

```
   EXPERT                    ADMIN                    SYSTEM
     │                         │                         │
     │  Fill register form      │                         │
     │  (category, skills...)   │                         │
     │─────────────────────────────────────────────────► │
     │                         │            Create User (EXPERT)
     │                         │            Create ExpertProfile (PENDING)
     │                         │            ◄─────────────────────────────│
     │                         │                         │
     │  Try to login            │                         │
     │─────────────────────────────────────────────────► │
     │  ◄─── ❌ "Pending        │            Check profile status
     │         approval"        │            Status = PENDING → block
     │                         │                         │
     │                         │  Login as admin          │
     │                         │──────────────────────── ►│
     │                         │  View Approvals page     │
     │                         │◄────────────────────────┤
     │                         │  See Alice in list       │
     │                         │                         │
     │                         │  Click "Approve"         │
     │                         │──────────────────────── ►│
     │                         │            Set status = APPROVED
     │                         │            ◄─────────────────────────────│
     │                         │  ✅ "Approved!"           │
     │                         │                         │
     │  Login again             │                         │
     │─────────────────────────────────────────────────► │
     │  ◄─── ✅ JWT Token       │            Status = APPROVED → generate JWT
     │                         │                         │
     │  /user/dashboard        │                         │
     │  Profile visible         │                         │
     │  to customers            │                         │
```

### Workflow 2: Complete Booking Lifecycle

```
   CUSTOMER                 EXPERT                   SYSTEM
     │                        │                         │
     │  Browse experts         │                         │
     │  Find Alice Smith       │                         │
     │                         │                         │
     │  Click "Book Now"       │                         │
     │  Fill requirement note  │                         │
     │  Set preferred date     │                         │
     │─────────────────────────────────────────────────►│
     │                         │            Booking created
     │                         │            Status: PENDING
     │  ◄─── ✅ "Request sent!" │            ◄────────────────────────────│
     │                         │                         │
     │                         │  Open My Bookings        │
     │                         │◄─── See new PENDING booking
     │                         │                         │
     │                         │  Click "Accept"          │
     │                         │──────────────────────── ►│
     │                         │            Status: ACCEPTED
     │  Booking shows ACCEPTED │            ◄────────────────────────────│
     │◄────────────────────────│                         │
     │                         │  Complete the work       │
     │                         │  Click "Mark Complete"   │
     │                         │──────────────────────── ►│
     │                         │            Status: COMPLETED
     │                         │            ◄────────────────────────────│
     │  Booking shows COMPLETED│                         │
     │  "Leave Review" appears │                         │
     │                         │                         │
     │  Click stars + comment  │                         │
     │  Click "Submit Review"  │                         │
     │─────────────────────────────────────────────────►│
     │                         │            Review saved
     │                         │            Alice's avg rating updated
     │  ◄─── ✅ "Reviewed!"     │            ◄────────────────────────────│
     │                         │                         │
     │                         │  Alice's profile now     │
     │                         │  shows updated ★ rating  │
```

---

## 11. Demo Accounts (Ready to Use)

| Role | Email | Password | How to Get It |
|------|-------|----------|---------------|
| **Admin** | `admin@instahelp.com` | `Admin@123` | Auto-created on server startup |
| **Expert** | Register yourself | Any password | Must be approved by admin first |
| **Customer** | Register yourself | Any password | Works immediately after registration |

> **Important:** H2 is an in-memory database. Every time the backend server restarts, all data is wiped **except** the admin account and the 12 categories (they're re-seeded automatically). Any experts/customers you register will need to be registered again after a restart.

---

## 12. How to Run the Application

### What You Need Installed First

```
┌───────────────────┬─────────────────┬───────────────────────────────┐
│ Software          │ Version         │ Check if installed            │
├───────────────────┼─────────────────┼───────────────────────────────┤
│ Java JDK          │ 21 or higher    │ Run: java -version            │
│ Maven             │ 3.x             │ Run: mvn -version             │
│ Node.js + npm     │ LTS (18 or 20)  │ Run: node -v && npm -v        │
└───────────────────┴─────────────────┴───────────────────────────────┘
```

### Option A: Command Line

**Start the Backend (Spring Boot):**
```bash
cd C:\Users\2457146\IH\backend
mvn spring-boot:run
```
Wait for: `Started InstaHelpApplication in X.XXX seconds`  
Backend is ready at: `http://localhost:8081`

**Start the Frontend (Angular):**
```bash
cd C:\Users\2457146\IH\frontend
npm install        # Only needed the first time
npm run start
```
Wait for: `Application bundle generation complete`  
Frontend is ready at: `http://localhost:4200`

**Open the App:**
Open your browser and go to: `http://localhost:4200`

### Option B: IntelliJ IDEA (for Backend)

```
1. Open IntelliJ IDEA
2. File → Open → select the "backend" folder
3. Wait for Maven to download dependencies (progress bar at bottom)
4. Find src/main/java/com/instahelp/InstaHelpApplication.java
5. Click the green ▶ Run button
6. IMPORTANT: Always stop (◼) the old run before starting a new one
   (to avoid "Port 8081 already in use" error)
```

### Verify Everything is Working

```
Backend check:  Open http://localhost:8081/api/public/categories
                Should return: [{"id":1,"name":"Electrician",...}, ...]

Frontend check: Open http://localhost:4200
                Should show the InstaHelp home page with expert cards

H2 Database:    Open http://localhost:8081/h2-console
                JDBC URL: jdbc:h2:mem:instahelp_db
                Username: sa
                Password: (leave blank)
                Click Connect → you can run SQL queries
```

---

## 13. Environment Configuration

### Switching from H2 to MySQL (For Production)

H2 (development) vs MySQL (production):

```
H2 (current — development):          MySQL (production):
✓ No installation needed              ✓ Data survives restarts
✓ Starts automatically                ✓ Production-grade performance
✓ Great for demos/testing             ✓ Handles many users
✗ Data lost on restart                ✗ Requires MySQL server install
✗ Not suitable for production         ✗ More setup needed
```

To switch to MySQL, update `application.properties`:

```properties
# Remove/comment out these H2 lines:
# spring.datasource.url=jdbc:h2:mem:...
# spring.datasource.driver-class-name=org.h2.Driver
# spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
# spring.h2.console.enabled=true

# Add these MySQL lines:
spring.datasource.url=jdbc:mysql://localhost:3306/instahelp_db?createDatabaseIfNotExist=true
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update   # "update" keeps existing data, "create-drop" wipes on restart
```

### Changing the API URL (if backend moves to a different server)

Update `frontend/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://your-new-backend-address:port/api'
};
```

---

## 14. API Reference (All Endpoints)

### How to Make Requests

Every request to a protected endpoint needs:
```
Header: Authorization: Bearer <your-JWT-token>
Header: Content-Type: application/json
```

### Auth Endpoints (No Token Needed)

#### Register as Expert
```http
POST http://localhost:8081/api/auth/register
Content-Type: application/json

{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "password": "Alice@123",
  "role": "EXPERT",
  "categoryId": 1,
  "workDescription": "Professional electrician with 8 years experience",
  "skills": "Wiring, Panel Upgrades, LED Lighting",
  "experienceYears": 8,
  "location": "Mumbai"
}
```

#### Register as Customer
```http
POST http://localhost:8081/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "John@123",
  "role": "CUSTOMER"
}
```

#### Login (any role)
```http
POST http://localhost:8081/api/auth/login
Content-Type: application/json

{
  "email": "admin@instahelp.com",
  "password": "Admin@123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "ADMIN",
  "name": "Administrator",
  "email": "admin@instahelp.com"
}
```

### Admin Endpoints (Needs ADMIN token)

#### Get Platform Stats
```http
GET http://localhost:8081/api/admin/dashboard/stats
Authorization: Bearer <ADMIN_TOKEN>

Response:
{
  "totalExperts": 12,
  "pendingExperts": 3,
  "totalCustomers": 45,
  "totalBookings": 127
}
```

#### Approve an Expert
```http
PUT http://localhost:8081/api/admin/experts/2/approve
Authorization: Bearer <ADMIN_TOKEN>
```

#### Reject an Expert
```http
PUT http://localhost:8081/api/admin/experts/2/reject
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "reason": "Profile information is incomplete. Please add skills and work description."
}
```

### Customer Endpoints (Needs CUSTOMER token)

#### Create a Booking
```http
POST http://localhost:8081/api/customer/bookings
Authorization: Bearer <CUSTOMER_TOKEN>
Content-Type: application/json

{
  "expertId": 2,
  "requirementNote": "Need help with home wiring for new room addition",
  "scheduledDate": "2026-04-20T00:00:00"
}

Note: scheduledDate must include the time (T00:00:00) — date alone won't work.
      Leave null if you have no preferred date.
```

#### Submit a Review
```http
POST http://localhost:8081/api/customer/reviews
Authorization: Bearer <CUSTOMER_TOKEN>
Content-Type: application/json

{
  "bookingId": 1,
  "rating": 5,
  "comment": "Excellent work! Very professional and on time."
}
```

### Expert Endpoints (Needs EXPERT token)

#### Accept a Booking
```http
PUT http://localhost:8081/api/user/bookings/1/accept
Authorization: Bearer <EXPERT_TOKEN>
```

#### Mark Booking as Complete
```http
PUT http://localhost:8081/api/user/bookings/1/complete
Authorization: Bearer <EXPERT_TOKEN>
```

### Error Response Format
```json
{
  "message": "Description of what went wrong",
  "timestamp": "2026-04-09T17:00:00.000"
}
```

---

## 15. Bugs Found & Fixed

During development and QA testing, **16 bugs** were found and fixed. Here is a complete record:

```
Legend:
  F = Frontend (Angular)  |  B = Backend (Spring Boot)
  💡 = Root cause explanation
```

| # | Where | What Was Wrong | How It Was Fixed |
|---|-------|---------------|-----------------|
| 1 | B | Register form called `/api/auth/register` but backend only had `/register/expert` and `/register/customer` separately | Added a single unified `POST /api/auth/register` endpoint that handles both roles |
| 2 | F | Registration page loaded categories from `/api/admin/categories` — which requires admin login | Added a new public endpoint `GET /api/public/categories` that anyone can access |
| 3 | B | Admin account was missing on startup — had to create manually every time | Added `DataInitializer.java` which auto-creates the admin account when the server starts |
| 4 | B | App crashed on startup with Lombok errors | Upgraded Lombok 1.18.30 → 1.18.38 and Spring Boot 3.2 → 3.4 (compatibility fix) |
| 5 | B | App required MySQL to be installed — failed to start without it | Switched from MySQL to H2 in-memory database for development (no install needed) |
| 6 | F | Frontend stored and checked `role = "USER"` but backend returns `role = "EXPERT"` | Fixed role string in 6 places across the frontend (login, guards, navbar, etc.) |
| 7 | B | The endpoint to mark a booking as "complete" was missing entirely | Added `PUT /api/user/bookings/{id}/complete` to UserController and UserService |
| 8 | F | Admin dashboard called `/api/admin/dashboard-stats` (wrong URL) | Fixed to `/api/admin/dashboard/stats` |
| 9 | F | Admin approvals page called `/api/admin/pending-experts` (wrong URL) | Fixed to `/api/admin/experts/pending` |
| 10 | F | Admin approve/reject used `POST /admin/approve` with a status field | Fixed to use `PUT /admin/experts/{userId}/approve` and `PUT /admin/experts/{userId}/reject` |
| 11 | F | 5 customer components called `/customers/` (plural — wrong path) | Fixed all to `/customer/` (singular) matching backend route |
| 12 | F | 3 expert components called `/users/` (plural — wrong path) | Fixed all to `/user/` (singular) matching backend route |
| 13 | F | Book expert page loaded expert profile from `/customers/experts/{id}` (wrong) | Fixed to `/customer/experts/{id}` |
| 14 | F | Date was sent as `"2026-04-20"` but backend needs `LocalDateTime` format | Fixed by appending time: `"2026-04-20T00:00:00"` before sending |
| 15 | F | Accept booking called URL `.../bookings/{id}/accepted` (past tense — wrong verb) | Fixed with mapping: `ACCEPTED→accept`, `DECLINED→decline`, `COMPLETED→complete` |
| 16 | B | IntelliJ kept crashing with "Port 8081 already in use" on every restart | Removed `spring-boot-devtools` from `pom.xml` entirely — DevTools was binding the port twice |

---

*InstaHelp — Your trusted expert marketplace*  
*© 2026 InstaHelp. All rights reserved.*
