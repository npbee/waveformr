# syntax = docker/dockerfile:1

FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm build && pnpm prune --prod

FROM base
ENV NODE_ENV=production

# Runtime dependencies for audiowaveform
RUN apk --no-cache add \
  ca-certificates \
  gcc \
  zlib-static \
  libpng-static \
  boost-static

COPY --from=ghcr.io/medleybox/audiowaveform-alpine:master /bin/audiowaveform /bin/audiowaveform

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public

USER node
EXPOSE 3000
CMD ["node_modules/.bin/remix-serve", "build/index.js"]
