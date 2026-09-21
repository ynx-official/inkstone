# Inkstone

Markdown notebook frontend using React, TypeScript, Vite and CodeMirror with the Tiny Note Go backend. Both clients share accounts and notes.

[Chinese](README_ZH.md) · [Documentation](docs/README.md) · [License](LICENSE)

## Run and build

Use Node 24. Install dependencies only when missing or changed.

```sh
npm run dev
npm run build
```

Development runs at `http://localhost:7712` and proxies to `http://127.0.0.1:8081`. Override the target with the process environment variable `INKSTONE_API_TARGET`. Run Go separately in the sibling `tiny-blog-go` repository.

Production output is static content in `dist/client`. `VITE_API_BASE_URL` overrides the API base at build time. Set `INKSTONE_PUBLIC_URL` on Go to the exact frontend origin. See [deployment](docs/05-operations/tiny-build-and-deployment.md).

## Migration status

The default development and production build use Tiny Go without launching a Worker. Shared notes, folders, tags, versions, sessions, files, search and synchronization have an initial implementation. Account management uses Tiny.

Full migration remains in progress: sharing, remote backups, external MCP/OAuth, optional semantic search and remaining concurrency checks are incomplete. Legacy Worker code, dependencies and deployment scripts remain pending removal. Do not use the old `deploy` commands for this static build.

See the [verification record](docs/04-quality/go-backend-verification.md). Original Cloudflare instructions are [archived](docs/99-archive/cloudflare-readme.md).

## Checks

```sh
npm run test:unit
npm run typecheck
npm run i18n:check
npm run comments:check
```

Existing end-to-end scripts mutate data. Use only an isolated test backend.
