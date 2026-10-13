# University Enrollment System — Layered Architecture

Academic project focused on improving the architecture of the repository provided by the instructor. The solution maintains a monolithic backend built with Node.js and Express, organized into routes, controllers, services, and repositories. The frontend uses React, Vite, and Tailwind CSS, while PostgreSQL stores student records, user accounts, courses, and enrollments.

## Technologies

- **Frontend:** React, Vite, Tailwind CSS.
- **Backend:** Node.js, Express, JavaScript.
- **Communication:** REST API over HTTP/JSON.
- **Data storage:** PostgreSQL with parameterized queries using `pg`.
- **Authentication:** Signed JWTs, `HttpOnly` cookies, and password hashing with bcryptjs.
- **Additional security measures:** Helmet, rate limiting for authentication endpoints, configured CORS, and authentication middleware.
- **Testing:** Node.js test runner.

## Account Scope

The application allows users to register accounts exclusively with the `ESTUDIANTE` (STUDENT) role. Registration creates the academic profile and user account within a database transaction. Students can browse available courses and manage their own enrollments.

Course administration is not exposed to student accounts. Initial course data is loaded through `backend/sql/seed.sql`.

The JWT cookie is configured with the `HttpOnly` and `SameSite=Strict` attributes. In production, HTTPS and a sufficiently long, randomly generated `JWT_SECRET` must be used. The CSRF protection strategy and CORS configuration must also be reviewed according to the final deployment domain.

## Requirements

- Node.js 20 or later.
- npm.
- PostgreSQL 14 or later.

## PostgreSQL Configuration

1. Create the database:

   ```sql
   CREATE DATABASE matricula_universitaria;
   ```

2. Apply the database schema and initial data:

   ```bash
   psql -U postgres -d matricula_universitaria -f backend/sql/schema.sql
   psql -U postgres -d matricula_universitaria -f backend/sql/seed.sql
   ```

3. Copy `backend/.env.example` to `backend/.env` and configure `DATABASE_URL`, `JWT_SECRET`, `PORT`, and `FRONTEND_ORIGIN`.

   **Do not commit the `.env` file to GitHub.**

## Installation and Execution

From the project root directory, run:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
npm run dev
```

Frontend: [http://localhost:5173](http://localhost:5173)

API health check: [http://localhost:3000/api/health](http://localhost:3000/api/health)

## API Endpoints

- `GET /api/health` — checks the API health status.
- `POST /api/auth/register` — registers a student account.
- `POST /api/auth/login` — authenticates a user.
- `GET /api/auth/me` — retrieves the currently authenticated account.
- `POST /api/auth/logout` — logs out the current user.
- `GET /api/cursos` — retrieves the course catalog.
- `GET /api/matriculas/mis-matriculas` — retrieves enrollments belonging to the authenticated student.
- `POST /api/matriculas` — creates an enrollment for the authenticated student; the client only submits `cursoId`.

## Testing

Run the automated tests from the project root:

```bash
npm test
```

Unit tests cover general validation rules, basic password and email policies, and origin checks. PostgreSQL integration tests and HTTP authentication flows must be executed before claiming that the entire system has been successfully verified.

## Architecture Decisions

Architecture Decision Records (ADRs), also referred to as Architecture Decision Records (RDA), are located in `docs/adr/`.

The status of each decision should only be updated after the implementation has been verified and actual test results have been documented.