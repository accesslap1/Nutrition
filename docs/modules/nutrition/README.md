# Nutrition Backend V1

Nutrition is an isolated backend module composed into the shared Fitness Core API. It uses Core authentication and user UUIDs and does not duplicate platform identity, subscriptions, notifications, or consent.

## First vertical slice

- Search global and user-owned foods.
- Create user-owned foods.
- Log meals with server-authoritative calorie and macro calculations.
- Read the authenticated user's UTC daily meal summary.
- Delete only the authenticated user's meal logs.
- Log water and read the authenticated user's UTC daily water total.

Routes remain compatible with the existing `/api/v1/nutrition` snake_case mobile contract. Internal TypeScript and Prisma names use camelCase.

## Date and numeric conventions

- V1 daily summaries use UTC calendar dates until Core exposes a stable user-timezone contract.
- Nutrient values are calculated from per-100-gram values and rounded to two decimal places before persistence.
- UUIDs identify foods, meal logs, and water logs.
