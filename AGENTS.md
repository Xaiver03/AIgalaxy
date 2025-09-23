# Repository Guidelines

## Project Structure & Module Organization
- app/: Next.js App Router (routes, layouts, API under app/api).
- components/: Reusable React components (UI, feature blocks).
- lib/: Auth, database, and utility modules.
- prisma/: Prisma schema, client, and seed scripts.
- public/: Static assets.
- docs/ and deploy/: Documentation and deployment scripts/config.

## Build, Test, and Development Commands
- npm run dev: Start local dev server.
- npm run build: Production build (Next.js).
- npm start: Run built app.
- npm run lint: ESLint checks (next/core-web-vitals).
- npm run type-check: TypeScript type checks only.
- npm run db:push: Apply Prisma schema to DB.
- npm run db:generate: Generate Prisma client.
- npm run db:seed: Seed development data.
- npm run db:studio: Open Prisma Studio (DB viewer).
- npm run db:reset: Reset database (destructive; dev only).

## Coding Style & Naming Conventions
- Language: TypeScript + React (Next.js 14 App Router).
- Linting: ESLint extends next/core-web-vitals; fix warnings before PR.
- Components: PascalCase filenames in components/ (e.g., FeedbackButtons.tsx).
- Routes: Lowercase, hyphenated segment folders under app/ (e.g., app/admin, app/api).
- Variables/functions: camelCase; types/interfaces: PascalCase.
- CSS: Tailwind CSS; prefer utility classes over ad‑hoc CSS.

## Testing Guidelines
- Frameworks are not configured yet. If adding tests, prefer Jest + React Testing Library for units and Playwright for E2E.
- Place tests next to source files using .test.ts or .test.tsx.
- Maintain clear arrange/act/assert structure and keep tests deterministic.

## Commit & Pull Request Guidelines
- Commits: Conventional Commits format.
  - feat, fix, docs, style, refactor, test, chore
  - Example: feat(admin): add feedback button sorting
- PRs: Link issues, describe changes and impact, include screenshots/GIFs for UI, note DB changes/migrations and env vars.
- CI/CD: Ensure npm run lint, npm run type-check, and a successful build locally before requesting review.

## Security & Configuration Tips
- Environment: Copy .env.example to .env.local; set DATABASE_URL and related secrets.
- Data: Use npm run db:push and npm run db:seed for local setup; never commit real credentials or .env files.
