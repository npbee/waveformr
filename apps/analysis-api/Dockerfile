ARG DENO_VERSION=1.30.3
ARG BIN_IMAGE=denoland/deno:bin-${DENO_VERSION}
FROM ${BIN_IMAGE} AS bin

FROM healthsoft/audiowaveform-alpine:latest AS audiowaveform

FROM frolvlad/alpine-glibc:alpine-3.13

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

RUN apk --no-cache add \
  ca-certificates \
  gcc \
  zlib-static \
  libpng-static \
  boost-static

RUN addgroup --gid 1000 deno \
  && adduser --uid 1000 --disabled-password deno --ingroup deno \
  && mkdir /app/ \
  && chown deno:deno /app/

ENV DENO_DIR /app/
ENV DENO_INSTALL_ROOT /usr/local

ARG DENO_VERSION
ENV DENO_VERSION=${DENO_VERSION}
COPY --from=bin /deno /bin/deno

WORKDIR /app
COPY . .
COPY --from=ghcr.io/medleybox/audiowaveform-alpine:master /bin/audiowaveform /bin/audiowaveform

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY deps.ts .
RUN deno cache deps.ts

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts

EXPOSE 8000

ENTRYPOINT ["/bin/deno"]
CMD ["run", "-A", "./main.ts"]
