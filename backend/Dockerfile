FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY packages/api-contracts/package.json ./packages/api-contracts/package.json
COPY packages/shared-types/package.json ./packages/shared-types/package.json
COPY packages/shared-utils/package.json ./packages/shared-utils/package.json
COPY packages/shared-validation/package.json ./packages/shared-validation/package.json
RUN npm ci --workspace=@fitness/backend --include-workspace-root
COPY backend ./backend
RUN npm run prisma:generate --workspace=@fitness/backend && npm run build --workspace=@fitness/backend

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=10000
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY packages/api-contracts/package.json ./packages/api-contracts/package.json
COPY packages/shared-types/package.json ./packages/shared-types/package.json
COPY packages/shared-utils/package.json ./packages/shared-utils/package.json
COPY packages/shared-validation/package.json ./packages/shared-validation/package.json
RUN npm ci --omit=dev --workspace=@fitness/backend --include-workspace-root
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/node_modules/.prisma ./backend/node_modules/.prisma
COPY backend/prisma ./backend/prisma
EXPOSE 10000
CMD ["sh", "-c", "npm run prisma:deploy --workspace=@fitness/backend && node backend/dist/src/main.js"]
