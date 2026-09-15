# Fitty Nutrition

Full-stack, mobile-first Nutrition application with a React PWA frontend and a NestJS/PostgreSQL backend.

## Included

- Core authentication, users, profiles, subscriptions, settings, permissions, consent, goals, measurements, activity, streaks, and notifications.
- Nutrition foods, meal logging, daily calorie and macro totals, and hydration logging.
- PostgreSQL schema and Prisma migrations.
- Shared API contracts, validation, types, and utilities.
- Docker and deployment configuration.
- Automated Nutrition production API verification.
- Responsive Nutrition overview, meal diary, food logging, hydration, progress, and profile experiences.
- Render Blueprint for cloud-only deployment of the frontend, API, and database.

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

## Web application

The frontend is in `apps/web`. It is a responsive, installable web application designed to work on mobile, tablet, and desktop. The production build is published by Render; users do not need a local development environment.

## Expo mobile application

The universal React Native app is in `apps/mobile` and runs on Android, iOS, and web. `eas.json` includes an internal Android preview profile that produces an installable APK. The GitHub Actions workflow **Build Android preview** starts the cloud build after the repository is linked to an Expo project and the `EXPO_TOKEN` repository secret is configured.
