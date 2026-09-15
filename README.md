# Nutrition Backend Handoff

This package contains the shared Wellness Core backend plus the Nutrition backend module. It is intended for frontend integration and contains no frontend application, Git history, installed dependencies, or secrets.

## Included

- Core authentication, users, profiles, subscriptions, settings, permissions, consent, goals, measurements, activity, streaks, and notifications.
- Nutrition foods, meal logging, daily calorie and macro totals, and hydration logging.
- PostgreSQL schema and Prisma migrations.
- Shared API contracts, validation, types, and utilities.
- Docker and deployment configuration.
- Automated Nutrition production API verification.

## Local API setup

1. Copy `backend/.env.example` to `backend/.env` and replace the placeholder JWT secrets.
2. Start PostgreSQL with `docker compose up -d postgres`.
3. Run `npm ci` from the package root.
4. Run `npm run prisma:generate --workspace=@fitness/backend`.
5. Run `npm run prisma:deploy --workspace=@fitness/backend`.
6. Run `npm run dev:backend`.

The default API base URL is `http://localhost:8000/api/v1`.

## Nutrition endpoints

All Nutrition endpoints require a bearer access token obtained from `/api/v1/register` or `/api/v1/login`.

- `GET /nutrition/foods?search=`
- `POST /nutrition/foods`
- `GET /nutrition/meals/today`
- `POST /nutrition/meals`
- `DELETE /nutrition/meals/:id`
- `GET /nutrition/water/today`
- `POST /nutrition/water`

Request and response fields at the API boundary use `snake_case`. The canonical interfaces are exported from `packages/api-contracts/src/nutrition`.

## Source-of-truth rule

The Wellness Core repository remains the canonical source for both the common backend and the Nutrition backend module. Backend fixes made while integrating the frontend must be contributed back to Core before refreshing this handoff package.
