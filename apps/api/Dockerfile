FROM denoland/deno:alpine-1.44.4
ARG GIT_REVISION
ENV DEPLOYMENT_ID=${GIT_REVISION}

# Dependencies for audiowaveform
RUN apk --no-cache add \
  ca-certificates \
  gcc \
  zlib-static \
  libpng-static \
  boost-static

EXPOSE 8000

WORKDIR /app

USER deno

COPY . .
COPY --from=ghcr.io/medleybox/audiowaveform-alpine:master /bin/audiowaveform /bin/audiowaveform

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts

CMD ["run", "-A", "./main.ts"]
