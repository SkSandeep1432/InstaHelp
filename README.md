# InstaHelp - Educational Service Marketplace

A full-stack service marketplace connecting customers with approved experts.

## Tech Stack
- **Frontend:** Angular 17 (standalone components) + Angular Material
- **Backend:** Spring Boot 3 (Java 17) + Spring Security + JWT
- **Database:** MySQL

---

## Prerequisites

- Java 17+
- Node.js 18+ and npm
- MySQL 8.0+
- Maven 3.8+

---

## Database Setup

MySQL database is auto-created on first run via `createDatabaseIfNotExist=true`.

Default credentials in `application.properties`:
```
username: root
password: root
database: instahelp_db
```

To change credentials, edit `backend/src/main/resources/application.properties`.

### Seed Admin Account

After starting the backend, insert an admin user manually:
```sql
USE instahelp_db;
INSERT INTO users (name, email, password, role, status, created_at)
VALUES (
  'Admin',
  'admin@instahelp.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lLi2',
  'ADMIN',
  'APPROVED',
  NOW()
);
```
This sets the admin password to `secret`. Change it via the API after first login.

---

## Running the Backend

```bash
cd backend
mvn spring-boot:run
```

The API will start on `http://localhost:8080`.

---

## Running the Frontend

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:4200`.

---

## API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |

### Admin (Role: ADMIN)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard-stats` | Dashboard stats |
| GET | `/api/admin/pending-experts` | List pending experts |
| POST | `/api/admin/approve` | Approve/reject expert |
| GET | `/api/admin/experts` | All experts |
| GET | `/api/admin/bookings` | All bookings |
| GET | `/api/admin/categories` | List categories |
| POST | `/api/admin/categories` | Create category |
| DELETE | `/api/admin/categories/{id}` | Delete category |

### Expert / User (Role: USER)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get own profile |
| PUT | `/api/users/profile` | Update profile |
| GET | `/api/users/bookings` | Get received bookings |
| PUT | `/api/users/bookings/{id}/status` | Update booking status |
| GET | `/api/users/dashboard-stats` | Expert stats |

### Customer (Role: CUSTOMER)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers/experts` | Browse approved experts (public) |
| GET | `/api/customers/experts/{id}` | Expert detail (public) |
| GET | `/api/customers/experts/{id}/reviews` | Expert reviews |
| POST | `/api/customers/bookings` | Create booking |
| GET | `/api/customers/bookings` | My bookings |
| POST | `/api/customers/reviews` | Submit review |
| GET | `/api/customers/dashboard-stats` | Customer stats |

---

## User Roles

### ADMIN
- Login at `/login`
- Default: `admin@instahelp.com` / `secret`
- Can approve/reject expert registrations
- Manages categories and views all platform data

### Expert (USER role)
- Register at `/register` → select "Expert"
- Status starts as PENDING — requires admin approval
- After approval: can accept/decline/complete bookings
- Can update their profile and skills

### Customer (CUSTOMER role)
- Register at `/register` → select "Customer"
- Immediately active after registration
- Browse experts, book services, leave reviews

---

## Project Structure

```
IH/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/instahelp/
│       ├── InstaHelpApplication.java
│       ├── config/SecurityConfig.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── AdminController.java
│       │   ├── UserController.java
│       │   └── CustomerController.java
│       ├── dto/           (request/response DTOs)
│       ├── exception/     (GlobalExceptionHandler)
│       ├── model/         (JPA entities + enums)
│       ├── repository/    (Spring Data JPA repos)
│       ├── security/      (JwtUtil, JwtAuthFilter)
│       └── service/       (AuthService, AdminService, UserService, CustomerService)
│
└── frontend/
    ├── angular.json
    ├── package.json
    └── src/app/
        ├── app.component.ts
        ├── app.config.ts
        ├── app.routes.ts
        ├── core/
        │   ├── guards/    (authGuard, roleGuard)
        │   ├── interceptors/ (jwtInterceptor)
        │   ├── models/    (user.model.ts, booking.model.ts)
        │   └── services/  (auth.service.ts, api.service.ts)
        ├── modules/
        │   ├── auth/      (login, register)
        │   ├── admin/     (dashboard, user-approvals, bookings, categories)
        │   ├── user/      (dashboard, profile, my-bookings)
        │   └── customer/  (home, expert-list, expert-detail, book-expert, my-bookings)
        └── shared/
            └── components/navbar/
```
