#!/bin/zsh

deno task --cwd api dev &
cd web && pnpm dev
