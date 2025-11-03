# GEMINI.md

## Project Overview

This is a Next.js web application for **CardioNova**, a cardiology clinic. The application provides a public-facing website and a secure portal for medical professionals.

- **Public Website:** Includes pages for home, services, about us, and contact.
- **Medical Portal (`/acceso-medicos`):** A secure area for authenticated users with role-based access control (Admin, Doctor, Secretary). It includes a dashboard, clinical history management, user management, and reporting features.

## Technologies

- **Framework:** [Next.js](https://nextjs.org/) (v16) with the App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [React](https://react.dev/) (v19)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Authentication:** [better-auth](https://www.npmjs.com/package/better-auth)

## Building and Running

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/)

### Key Commands

- **Install dependencies:**
  ```bash
  pnpm install
  ```
- **Run the development server:**
  ```bash
  pnpm dev
  ```
  The application will be available at [http://localhost:3000](http://localhost:3000).

- **Create a production build:**
  ```bash
  pnpm build
  ```

- **Start the production server:**
  ```bash
  pnpm start
  ```

- **Lint the code:**
  ```bash
  pnpm lint
  ```

## Development Conventions

### Code Style

- The project uses ESLint for code linting. Run `pnpm lint` to check for issues.
- The styling is based on a "clean, minimalist, and professional" design, with a primary color palette of dark blue (`#1E3A8A`), cardiac red (`#E11D48`), and white.

### Database

- The database schema is managed by Drizzle ORM and is defined in `app/db/schema.ts`.
- Database migrations are located in the `drizzle/` directory.

### Authentication

- Authentication is handled by `better-auth`.
- User roles (`admin`, `doctor`, `secretary`) are defined in the `user` table in the database.
- The authentication logic is configured in `app/lib/auth.ts`.
