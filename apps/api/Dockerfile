# syntax = docker/dockerfile:1

# Build context is the repo root so the pnpm workspace lockfile is available.
# See the `deploy` and `docker` scripts in package.json.

FROM node:24-alpine AS build
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile --filter @waveformr/api
RUN pnpm --filter @waveformr/api deploy --prod /prod/api

FROM node:24-alpine
ARG GIT_REVISION
ENV DEPLOYMENT_ID=${GIT_REVISION}
ENV NODE_ENV=production

# Dependencies for audiowaveform
RUN apk --no-cache add \
  ca-certificates \
  gcc \
  zlib-static \
  libpng-static \
  boost-static

COPY --from=ghcr.io/medleybox/audiowaveform-alpine:master /bin/audiowaveform /bin/audiowaveform

WORKDIR /app
COPY --from=build /prod/api .

USER node
EXPOSE 8000

CMD ["node", "server.ts"]
