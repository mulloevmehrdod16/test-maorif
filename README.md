# MAORIF ISTIKLOL

A public education portal and the foundation of a school management platform for Istiklol, Sughd Region, Tajikistan.

## Current implementation

This repository is being built in phases. The current foundation includes a responsive trilingual public homepage (Tajik default, Russian, English), a PostgreSQL/Prisma data model, database-backed public school/news/announcement counts, JWT login, first-login password changes, and MAIN_ADMIN-only school/director creation endpoints.

Not yet implemented: full school journals, teacher/student workflows, grade/attendance/behavior corrections, all role dashboards, and production session revocation. Do not treat this foundation as a complete or production-ready school system.

## Requirements

- Node.js 20+
- PostgreSQL 14+
- npm

## Windows / VS Code setup

1. Install Node.js LTS and PostgreSQL. Open this folder in VS Code.
2. In PowerShell, create local environment settings:
   ```powershell
   Copy-Item .env.example .env
   ```
3. Edit `.env` with a local PostgreSQL connection string and generate a random JWT secret of at least 32 characters. Never commit `.env`.
4. Install dependencies and generate Prisma Client:
   ```powershell
   npm install
   npx prisma generate
   ```
5. Create the local database schema and seed role records:
   ```powershell
   npx prisma db push
   npm run db:seed
   ```
6. Start the server:
   ```powershell
   npm run dev
   ```
7. Visit http://localhost:4000. Run automated tests with `npm test`.

Create the PostgreSQL database named `maorif_istiklol` before running Prisma, or change `DATABASE_URL` to a database that already exists.

## Configuration

Copy `.env.example` to `.env`. Set `DATABASE_URL`, `JWT_SECRET` (at least 32 random characters), `APP_URL`, and `NODE_ENV`. The public homepage reads only published content and live counts from PostgreSQL; it does not invent production statistics. If the database is unavailable, the API reports an error instead of presenting placeholder figures.

## Seed account warning

`prisma/seed.js` creates a demo MAIN_ADMIN account for local development. Its starter password is for local testing only. Change it immediately and never deploy the seed account or its sample password to a public environment. No real credentials are included in this repository.

## Admin API foundation

- `POST /api/auth/login` — authenticate with seeded or provisioned account.
- `POST /api/auth/first-login` — set a new password with the temporary-login token.
- `GET /api/auth/me` — current account profile.
- `GET /api/admin/overview` — live school/student/teacher/class counts; MAIN_ADMIN only.
- `GET /api/admin/schools` and `POST /api/admin/schools` — school management; MAIN_ADMIN only.
- `POST /api/admin/schools/:schoolId/directors` — creates an inactive director account and returns a generated login and temporary password once. Deliver these credentials securely to the director.
- Public data: `GET /api/public/home`, `/api/public/schools`, `/api/public/schools/:id`.

Authenticated API requests must send `Authorization: Bearer <token>`. Never send role claims in custom headers; role permissions are loaded from the database.

## Security and production notes

The project is an early development foundation and has not undergone independent security review. Before deployment, configure HTTPS, secure secret storage, database backups and monitoring; review authorization and privacy behavior; add account recovery, token revocation, audit retention, file upload scanning, and automated school-isolation tests. The seeded admin password and temporary director credentials are sensitive. Store no secrets in browser code or version control.

## Deployment

Build and test in a staging environment first. Provide PostgreSQL and environment variables to the server process, install dependencies with `npm ci`, run `npx prisma generate`, apply a reviewed Prisma migration, and start with `npm start` behind an HTTPS reverse proxy. The schema currently has no committed migration history; review schema changes and create initial migrations before production use.
