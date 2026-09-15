# Fitness backend

Shared modular backend for the Fitness ecosystem, built with NestJS, TypeScript, Prisma, and PostgreSQL.

## Local setup

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL from the repository root with `docker compose up -d postgres`.
3. Run `npm install`.
4. Run `npm run prisma:generate` and `npm run prisma:migrate`.
5. Run `npm run start:dev`.

All HTTP endpoints are versioned beneath `/api/v1`. Swagger documentation is available at `/api/docs` outside production.

## Boundaries

- `src/core`: shared platform capabilities used by every wellness module.
- `src/modules`: module-owned business capabilities.
- `src/shared`: technical building blocks without module business rules.
- `prisma`: the shared database schema and migration history.
