# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                                                        # Watch mode via tsx
pnpm build                                                      # Compile TypeScript
pnpm start                                                      # Run compiled output (node index.js)
pnpm typeorm:run-migrations                                     # Run pending migrations
pnpm typeorm:generate-migration --name=MigrationName           # Generate migration from entity diff
```

No test runner is configured (`test` script exits 1). There is no lint script.

## Architecture

### Request Lifecycle

All routes are registered **after** DB initialization in `src/index.ts`. The `DataSource` instance is passed into every router factory (`createXRouter(dataSource)`) and then into every controller. This is the DI pattern — no IoC container, just constructor injection via closures.

Route middleware order per request:
1. `authenticate` (cookie → JWT verify → DB token check) — from `src/shared/middlewares/auth.middleware.ts`
2. `imageUploadHandler` (Multer + Cloudinary) — only on routes that accept file uploads
3. `validateRequestBody` / `validateRequestQuery` / `validateRequestParams` — Zod parse, throws `ValidationError` on failure
4. Controller method

### Module Structure

Each feature in `src/modules/{feature}/` follows:
```
routes/       — Router factory, Swagger JSDoc comments, middleware wiring
controllers/  — Class extending BaseController, thin HTTP layer
services/     — Business logic, TypeORM repository access
entities/     — TypeORM @Entity classes, all extend BaseEntity
validators/   — Zod schemas for request input
dto/          — TypeScript interfaces for service input/output
```

Note: `event` module uses `contollers/` and `dtos/` (typos in directory names — match exactly when referencing).

### BaseEntity & BaseController

- **`BaseEntity`** (`src/shared/config/typeorm/base-entity.ts`): Provides `id` (UUID PK), `createdAt`, `updatedAt`, `createdById`, `modifiedById` on every entity.
- **`BaseController`** (`src/shared/base/base.controller.ts`): All controllers extend this. Injects `AuditLogService` and exposes `createAuditLog(...)` — call it on every mutating operation.

### Flagship Event / Version System

`FlagshipEventVersion` (table: `flagship_event_versions`) represents a website version (e.g. v5–v8). Most content entities are scoped to a `versionId`. Routes under `/api/flagship-event/versions` manage these.

### Auth

- httpOnly cookies: `access_token` + `refresh_token`
- Tokens are stored in DB (`AccessToken`, `RefreshToken` entities) and checked on every authenticated request
- Revoked tokens are cleaned by a cron job (`CRON_REVOKED_TOKENS_SCHEDULE`, default `0 0 * * *`)
- Refresh via `POST /api/auth/refresh-token`

### Error Handling

- `AppError(message, statusCode)` — known application errors
- `ValidationError(message, zodIssues[])` — Zod validation failures (400)
- Global `errorHandler` middleware in `src/shared/utils/helpers/error.helper.ts` handles all three cases plus raw `ZodError`
- The handler is registered **twice** in `src/index.ts`: before DB init (catches startup errors) and after routes

### File Uploads

`imageUploadHandler` in `src/shared/utils/helpers/imageUpload.helper.ts` wraps Multer + Cloudinary. Use `{ fieldName, multiple, optional }`. Files are written to `public/` temporarily then uploaded to Cloudinary.

### Database

- MySQL via TypeORM DataSource (`src/shared/config/typeorm/db.config.ts`)
- `synchronize: true` only when `NODE_ENV === 'local'` — use migrations everywhere else
- Migrations live in `src/shared/config/typeorm/migrations/`
- All entities must be manually registered in `db.config.ts`

### Logging

Winston logger at `src/shared/utils/logger.utils.ts` with daily rotation. Pass `{ module, systemMessage, meta }` as the second argument to log calls.

### API Docs

Swagger UI: `GET /api-docs` | Spec JSON: `GET /api-docs.json`
Swagger annotations live inline in route files as JSDoc `@swagger` comments.

## Environment Variables

See `.env.sample`. `NODE_ENV` must be `local`, `dev`, or `prod`. The `local` value enables DB sync; `dev`/`prod` require migrations.
