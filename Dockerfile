# syntax = docker/dockerfile:1

# This is the dockerfile for the remix app. It's at the top level top level 
# because I'm using a PNPM monorepo setup and important files live at the root

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.3.1
FROM node:${NODE_VERSION}-slim as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

LABEL fly_launch_runtime="Remix"

# Remix app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# This repo is set up as a monorepo, but we're only deploying the remix app 
# here. 
FROM base AS build
COPY ./apps/web ./apps/web
COPY --link pnpm-lock.yaml package.json pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Bring all remix deps together
RUN pnpm deploy --filter=@waveformr/web /prod/web

# Now build it
WORKDIR /prod/web
RUN pnpm build

# Final stage for app image
FROM base as web
COPY --from=build /prod/web /prod/web
WORKDIR /prod/web

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "start" ]
