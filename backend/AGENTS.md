# Backend contribution rules

This backend uses Node.js, NestJS, TypeScript, Prisma, and PostgreSQL.

## Required checks

Run these before proposing a backend change:

```sh
npm run prisma:generate --workspace=@fitness/backend
npm run build --workspace=@fitness/backend
npm run lint --workspace=@fitness/backend
npm run test --workspace=@fitness/backend
```

## Architecture boundaries

- Shared platform capabilities belong in `src/core`.
- Reusable technical infrastructure belongs in `src/shared`.
- Product-specific behavior belongs in `src/modules/<module>`.
- Core must never import a product module.
- Modules must not import another module directly.
- Mobile and Admin applications must use the versioned API rather than database access.
- Update Prisma migrations and shared API contracts when persistence or response contracts change.
- Never commit secrets or real credentials.
