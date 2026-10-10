# Analysis API

This is an HTTP API over the
[audiowaveform](https://github.com/bbc/audiowaveform) CLI. It mostly works, but
isn't in use at the moment.

## Development

Requires Node 24+ (TypeScript runs directly via Node's type stripping) and
`audiowaveform` on your `PATH`.

```sh
pnpm dev          # watch mode on :8000, metrics on :9091
pnpm test         # snapshot + unit tests
pnpm test:update  # rewrite snapshots in __images__
pnpm typecheck
pnpm fmt
```
