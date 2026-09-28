# Secure Login System

A minimal full-stack starter: a **Spring Boot** backend issues JWTs on login and protects its
API routes with a stateless filter; a **React** frontend stores the token, attaches it to every
request, and guards its own routes with a `ProtectedRoute` component.

## Stack

- **Backend**: Spring Boot 3.3, Spring Security 6, Spring Data JPA, MySQL 8, `jjwt` for JWT
- **Frontend**: React 19, Vite, React Router 7, Axios

## Project layout

```
Secure Login System/
  backend/    Spring Boot API (port 8081)
  frontend/   React app (port 5174)
```

## Database setup (MySQL)

Requires a running MySQL 8 server. Create the database and a dedicated app user by running the
provided script as an admin:

```bash
mysql -u root -p < backend/sql/init-db.sql
```

This creates database `jwtauthdb` and user `jwtauth_app` (password `JwtAuth_App_2026!`), matching
the defaults in `application.properties`. To use different credentials, either edit the script
before running it, or override the defaults with environment variables (see below) instead of
editing `application.properties`.

Hibernate creates/updates the schema automatically on startup (`spring.jpa.hibernate.ddl-auto=update`) —
no manual migrations needed for this starter.

## Running the backend

```bash
cd backend
./mvnw spring-boot:run
```

Starts on `http://localhost:8081` and connects to MySQL at `jdbc:mysql://localhost:3306/jwtauthdb`.
Override connection details without touching the properties file:

```bash
DB_USERNAME=jwtauth_app DB_PASSWORD=JwtAuth_App_2026! ./mvnw spring-boot:run
```

The test suite (`./mvnw test`) does not need MySQL running — it uses an in-memory H2 database via
the `test` Spring profile (`src/test/resources/application-test.properties`).

### API

| Method | Endpoint             | Auth required | Description                       |
|--------|-----------------------|----------------|------------------------------------|
| POST   | `/api/auth/register`  | No             | Create a new user                  |
| POST   | `/api/auth/login`     | No             | Returns a JWT + user info          |
| GET    | `/api/users/me`       | Yes (JWT)      | Example protected route            |

Send the token on protected requests as `Authorization: Bearer <token>`.

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

Starts on `http://localhost:5174` (fixed via `vite.config.js` so it matches the backend's CORS
config in `application.properties`). Set `VITE_API_BASE_URL` in `frontend/.env` if the backend
runs elsewhere.

## How auth + protected routes work

**Backend**
- `SecurityConfig` sets stateless sessions, permits `/api/auth/**`, and requires a valid JWT for
  everything else (`/api/admin/**` also requires the `ADMIN` role).
- `JwtAuthFilter` runs once per request, reads the `Authorization` header, validates the token via
  `JwtUtil`, and populates the Spring Security context so `@RestController`s can use
  `Authentication`/`Principal` as usual.
- Passwords are hashed with BCrypt (`PasswordEncoder` bean); never stored in plaintext.

**Frontend**
- `AuthContext` holds the current user/token (persisted to `localStorage`) and exposes
  `login`/`register`/`logout`.
- `axiosClient` attaches `Authorization: Bearer <token>` to every request via a request
  interceptor, and clears the session + redirects to `/login` on a `401` response interceptor.
- `ProtectedRoute` wraps any route that requires auth (see `/dashboard` in `App.jsx`); an
  unauthenticated visitor is redirected to `/login` and sent back after signing in.

## Notes for production use

- Replace `app.jwt.secret` in `application.properties` with a securely generated secret (not
  committed to source control) and load it from an environment variable.
- Don't reuse the default `jwtauth_app` / `JwtAuth_App_2026!` credentials outside local dev;
  set `DB_USERNAME` / `DB_PASSWORD` env vars instead of editing the properties file.
- Set `spring.jpa.hibernate.ddl-auto=validate` (or use a migration tool like Flyway/Liquibase)
  once the schema stabilizes, instead of relying on `update` to alter tables in place.
- Consider adding refresh tokens if you need sessions longer than the access token's expiry
  (`app.jwt.expiration-ms`).
