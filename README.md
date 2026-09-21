# Inkstone

Markdown notebook frontend using React, TypeScript, Vite and CodeMirror with the Tiny Note Go backend. Both clients share accounts and notes.

[Chinese](README_ZH.md) · [Documentation](docs/README.md) · [License](LICENSE)

## Run and build

Use Node 24. Install dependencies only when missing or changed.

```sh
npm run dev
npm run build:prod
```

Development runs at `http://localhost:7712`. `.env.development` configures `INKSTONE_API_TARGET`, defaulting to `http://127.0.0.1:8081`. Run Go separately in the sibling `tiny-blog-go` repository.

Production output is static content in `dist/client`. `.env.production` sets `VITE_API_BASE_URL` at build time; `.env` holds shared defaults and `.env.demo` configures the standalone demo. Use ignored `.env.development.local` and `.env.production.local` for personal overrides. Never put credentials in frontend environment files. Set `INKSTONE_PUBLIC_URL` on Go to the exact frontend origin. See [deployment](docs/05-operations/tiny-build-and-deployment.md).

`npm run build` aliases `build:prod`. `npm run preview` serves the existing production build without rebuilding. `dev:demo` and `build:demo` retain the standalone demo.

## Migration status

The default development and production build use Tiny Go without launching a Worker. Shared notes, folders, tags, versions, sessions, files, search and synchronization have an initial implementation. Account management uses Tiny.

Full migration remains in progress: sharing, remote backups, external MCP/OAuth, optional semantic search and remaining concurrency checks are incomplete. Worker-only dependencies, deployment commands and Wrangler configuration have been removed. Historical Worker source remains for migration reference outside the active TypeScript build.

See the [verification record](docs/04-quality/go-backend-verification.md). Original Cloudflare instructions are [archived](docs/99-archive/cloudflare-readme.md).

## Checks

```sh
npm run test:unit
npm run typecheck
npm run i18n:check
npm run comments:check
```

Existing end-to-end scripts mutate data. Use only an isolated test backend.
