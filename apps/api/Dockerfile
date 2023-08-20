FROM denoland/deno:alpine
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

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
RUN deno cache deps.ts

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts

CMD ["run", "-A", "./main.ts"]
