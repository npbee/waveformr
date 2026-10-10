# syntax = docker/dockerfile:1

FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

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

# Nitro bundles the server, its dependencies, and public assets here
COPY --from=build /app/.output ./.output

USER node
EXPOSE 3000
ENV PORT=3000
CMD ["node", ".output/server/index.mjs"]
