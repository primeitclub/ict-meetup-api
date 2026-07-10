# Non-versioned Site Settings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move club email/phone, social media links, and the payment QR code off the per-version `Settings` entity onto a new global singleton (`SiteSettings`), across the backend API, the admin dashboard, and the public site — while Contact Management (general email/phone/department contacts) stays exactly as versioned as it is today.

**Architecture:** A new backend module `site-settings` (entity/validator/service/controller/routes, mirroring the existing `settings` module) exposes `GET/PUT /api/site-settings` and `DELETE /api/site-settings/qrcode`, backed by a table that will only ever hold one row. The existing `settings` module shrinks to just what Contact Management needs. Three admin pages (Club Details, Social Media, Payment Setup) drop their version picker/table UX in favor of a single always-visible form. Five public-site files switch from the versioned settings endpoints to the new global one for the fields that moved.

**Tech Stack:** Express + TypeORM + MySQL + Zod (`ict-meetup-api`), React + TanStack Query + react-hook-form (`ict-meetup-admin`, `ict-frontend`).

## Global Constraints

- Spec: `ict-meetup-api/docs/superpowers/specs/2026-07-08-non-versioned-site-settings-design.md` — read it before starting; this plan implements it exactly.
- No automated test runner exists in any of the three repos (`ict-meetup-api`'s `test` script exits 1; `ict-meetup-admin`/`ict-frontend` have none configured). Every task's "test cycle" is a manual verification step (curl command or browser check with an expected result) instead of an automated test — do not attempt to add a test framework as part of this work.
- `NODE_ENV=local` in `ict-meetup-api/.env` — TypeORM `synchronize: true`, so entity changes apply automatically on `pnpm dev` restart. No migration needs to be run to verify locally (Task 8 covers generating one for non-local envs).
- Follow existing module structure exactly: `entities/`, `validators/`, `services/`, `controllers/`, `routes/` subfolders, one file per concern, matching the existing `settings` module.
- Before Task 5 (dropping columns), if there's any real club email/phone/social link/QR code currently saved in the dev DB, write it down or screenshot it — those values are gone once the columns drop (per spec's accepted risk) and Task 20 asks you to re-enter them.

---

## Task 1: Audit scope, swagger tag, and the imageUploadHandler version-folder fix

**Files:**
- Modify: `ict-meetup-api/src/shared/constants/audit-log.constants.ts`
- Modify: `ict-meetup-api/src/shared/utils/swagger.utils.ts`
- Modify: `ict-meetup-api/src/shared/utils/helpers/imageUpload.helper.ts:62-78`

**Interfaces:**
- Produces: `AuditLogScope.SITE_SETTINGS` (used by Task 4's controller), a `"site-settings"` special case in `imageUploadHandler`'s destination resolver (required by Task 4's QR upload route).

- [ ] **Step 1: Add the `SITE_SETTINGS` audit scope**

In `ict-meetup-api/src/shared/constants/audit-log.constants.ts`, find:

```ts
  SETTINGS = 'settings',
  USERS = 'users',
```

Change to:

```ts
  SETTINGS = 'settings',
  SITE_SETTINGS = 'site_settings',
  USERS = 'users',
```

- [ ] **Step 2: Add the `SiteSettings` swagger tag**

In `ict-meetup-api/src/shared/utils/swagger.utils.ts`, find:

```ts
                  {
                        name: "Setting",
                        description:"API for managing settings "
                  }
],
```

Change to:

```ts
                  {
                        name: "Setting",
                        description:"API for managing settings "
                  },
                  {
                        name: "SiteSettings",
                        description: "API for managing global, non-versioned club settings (club contact, social links, payment QR code)"
                  }
],
```

- [ ] **Step 3: Fix `imageUploadHandler` to allow a versionless module**

In `ict-meetup-api/src/shared/utils/helpers/imageUpload.helper.ts`, find (inside the `storage.destination` callback):

```ts
      if (!versionId) {
        // Fallback for creating new flagship event version
        if (req.body.version_name) {
          versionName = req.body.version_name;
        } else if (moduleName === "flagship-event") {
          // Special case: Flagship event logo can be uploaded even if name/id isn't in body yet
          versionName = "flagship-main";
        } else {
          return cb(new AppError("Version ID or version_name is required", 400), "");
        }
      } else {
```

Replace with:

```ts
      if (!versionId) {
        // Fallback for creating new flagship event version
        if (req.body.version_name) {
          versionName = req.body.version_name;
        } else if (moduleName === "flagship-event") {
          // Special case: Flagship event logo can be uploaded even if name/id isn't in body yet
          versionName = "flagship-main";
        } else if (moduleName === "site-settings") {
          // Site settings is a global singleton with no version at all.
          versionName = "site-settings";
        } else {
          return cb(new AppError("Version ID or version_name is required", 400), "");
        }
      } else {
```

- [ ] **Step 4: Verify — type-check the backend**

Run: `cd ict-meetup-api && npx tsc --noEmit`
Expected: no errors (this only touches an enum member, a static array, and an `if/else if` branch — nothing calls the new enum member or module name yet, so this must compile clean).

- [ ] **Step 5: Commit**

```bash
cd ict-meetup-api
git add src/shared/constants/audit-log.constants.ts src/shared/utils/swagger.utils.ts src/shared/utils/helpers/imageUpload.helper.ts
git commit -m "feat: add SITE_SETTINGS audit scope, swagger tag, and versionless upload support"
```

---

## Task 2: `SiteSettings` entity, registered with TypeORM

**Files:**
- Create: `ict-meetup-api/src/modules/site-settings/entities/site-settings.entity.ts`
- Modify: `ict-meetup-api/src/shared/config/typeorm/db.config.ts`

**Interfaces:**
- Produces: `SiteSettings` class (columns: `clubEmail`, `clubPhoneNumber`, `socialMediaLinks`, `qrCodeUrl`, `qrCodePath`, `qrCodeLocalPath`, plus inherited `id`/`createdAt`/`updatedAt`/`createdById`/`modifiedById` from `BaseEntity`) — consumed by Task 3's service.

- [ ] **Step 1: Create the entity**

Create `ict-meetup-api/src/modules/site-settings/entities/site-settings.entity.ts`:

```ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../shared/config/typeorm/base-entity';

/**
 * Singleton table — a single club has one contact email/phone, one set of
 * social links, and one payment QR code, shared across all flagship event
 * versions. Always exactly zero or one row.
 */
@Entity({ name: 'site_settings' })
export class SiteSettings extends BaseEntity {
  @Column({ name: 'club_email', type: 'varchar', length: 255, nullable: true })
  clubEmail: string;

  @Column({ name: 'club_phone_number', type: 'varchar', length: 20, nullable: true })
  clubPhoneNumber: string;

  @Column({ name: 'social_media_links', type: 'json', nullable: true })
  socialMediaLinks: { platform: string; link: string }[];

  @Column({ name: 'qr_code_url', type: 'text', nullable: true })
  qrCodeUrl: string;

  @Column({ name: 'qr_code_path', type: 'text', nullable: true })
  qrCodePath: string;

  @Column({ name: 'qr_code_local_path', type: 'text', nullable: true })
  qrCodeLocalPath: string;
}
```

- [ ] **Step 2: Register the entity in `db.config.ts`**

In `ict-meetup-api/src/shared/config/typeorm/db.config.ts`, find:

```ts
import { Settings } from "../../../modules/settings/entities/settings.entity";
```

Change to:

```ts
import { Settings } from "../../../modules/settings/entities/settings.entity";
import { SiteSettings } from "../../../modules/site-settings/entities/site-settings.entity";
```

Then find:

```ts
  entities: [User, FlagshipEventVersion, AuditLog, AccessToken, RefreshToken, Category, TeamMember, AssetLibrary, Asset, Designation, HeroSection, AboutSection, Faq, Event, Speaker, Sponsor, EventRegistration, Gallery,Settings],
```

Change to:

```ts
  entities: [User, FlagshipEventVersion, AuditLog, AccessToken, RefreshToken, Category, TeamMember, AssetLibrary, Asset, Designation, HeroSection, AboutSection, Faq, Event, Speaker, Sponsor, EventRegistration, Gallery,Settings, SiteSettings],
```

- [ ] **Step 3: Verify — server starts and creates the table**

Run: `cd ict-meetup-api && pnpm dev` (let it run a few seconds, then stop it with Ctrl+C)
Expected console output: `Database connected successfully.` and `Server is running on port <PORT>` with no TypeORM errors.

Then run: `mysql -u <DB_USERNAME> -p<DB_PASSWORD> <DB_DATABASE> -e "DESCRIBE site_settings;"` (use the credentials from `ict-meetup-api/.env`)
Expected: a table listing with columns `id, created_at, updated_at, created_by_id, modified_by_id, club_email, club_phone_number, social_media_links, qr_code_url, qr_code_path, qr_code_local_path`.

- [ ] **Step 4: Commit**

```bash
cd ict-meetup-api
git add src/modules/site-settings/entities/site-settings.entity.ts src/shared/config/typeorm/db.config.ts
git commit -m "feat: add SiteSettings singleton entity"
```

---

## Task 3: `site-settings` validator and service

**Files:**
- Create: `ict-meetup-api/src/modules/site-settings/validators/site-settings.validator.ts`
- Create: `ict-meetup-api/src/modules/site-settings/services/site-settings.service.ts`

**Interfaces:**
- Consumes: `SiteSettings` entity (Task 2).
- Produces: `upsertSiteSettingsSchema`, `UpsertSiteSettingsDto` type, `SiteSettingsService` class with `get(): Promise<SiteSettings | null>`, `upsert(data, userId): Promise<SiteSettings>`, `removeQrCode(userId): Promise<SiteSettings>` — consumed by Task 4's controller.

- [ ] **Step 1: Create the validator**

Create `ict-meetup-api/src/modules/site-settings/validators/site-settings.validator.ts`:

```ts
import { z } from 'zod';

export enum SocialMediaPlatform {
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  LINKEDIN = 'LinkedIn',
  TWITTER = 'Twitter',
  TIKTOK = 'TikTok',
}

const socialMediaLinkSchema = z.object({
  platform: z.nativeEnum(SocialMediaPlatform),
  link: z.string().url(),
});

export const upsertSiteSettingsSchema = z.object({
  clubEmail: z.string().trim().email().optional().or(z.literal('')),
  clubPhoneNumber: z.string().trim().max(20).optional().or(z.literal('')),
  socialMediaLinks: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    },
    z.array(socialMediaLinkSchema).optional()
  ),
  qrCodeUrl: z.string().trim().optional(),
  qrCodePath: z.string().trim().optional(),
  qrCodeLocalPath: z.string().trim().optional(),
  uploadedImages: z.any().optional(),
});

export type UpsertSiteSettingsDto = z.infer<typeof upsertSiteSettingsSchema>;
```

`uploadedImages` must be declared here (even though it's not user input — `imageUploadHandler` sets it) because `validateRequestBody` calls `schema.parse(req.body)` and **replaces** `req.body` with only the fields the schema knows about. Without this field in the schema, the uploaded QR code's Cloudinary URL/public ID would be silently stripped before the controller ever sees it (see `settings.validator.ts`'s `createSettingsSchema` for the existing precedent — it has the same field for the same reason).

- [ ] **Step 2: Create the service**

Create `ict-meetup-api/src/modules/site-settings/services/site-settings.service.ts`:

```ts
import { DataSource, Repository } from 'typeorm';
import { SiteSettings } from '../entities/site-settings.entity';
import { UpsertSiteSettingsDto } from '../validators/site-settings.validator';
import logger from '../../../shared/utils/logger.utils';
import cloudinary from '../../../shared/config/cloudinary.config';
import fs from 'fs';
import path from 'path';

export class SiteSettingsService {
  private repository: Repository<SiteSettings>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(SiteSettings);
  }

  async get(): Promise<SiteSettings | null> {
    return this.repository.findOne({ where: {} });
  }

  async upsert(
    data: UpsertSiteSettingsDto & { uploadedImages?: any },
    userId: string
  ): Promise<SiteSettings> {
    const existing = await this.repository.findOne({ where: {} });

    const newQrCodePath = data.uploadedImages?.publicId;

    if (existing) {
      logger.info('Updating site settings', { module: 'SiteSettingsService' });

      // Replacing an existing QR code — delete the old Cloudinary asset first.
      if (newQrCodePath && existing.qrCodePath && newQrCodePath !== existing.qrCodePath) {
        await this.deleteFiles(existing.qrCodeLocalPath, existing.qrCodePath);
      }

      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([key, v]) => v !== undefined && key !== 'uploadedImages')
      );

      Object.assign(existing, cleanData, {
        qrCodeUrl: data.uploadedImages?.cloudUrl || data.qrCodeUrl || existing.qrCodeUrl,
        qrCodePath: data.uploadedImages?.publicId || data.qrCodePath || existing.qrCodePath,
        qrCodeLocalPath: data.uploadedImages?.localPath || data.qrCodeLocalPath || existing.qrCodeLocalPath,
        modifiedById: userId,
      });

      return this.repository.save(existing);
    }

    logger.info('Creating site settings', { module: 'SiteSettingsService' });
    const { uploadedImages, ...rest } = data;
    const created = this.repository.create({
      ...rest,
      qrCodeUrl: uploadedImages?.cloudUrl || data.qrCodeUrl,
      qrCodePath: uploadedImages?.publicId || data.qrCodePath,
      qrCodeLocalPath: uploadedImages?.localPath || data.qrCodeLocalPath,
      createdById: userId,
    });
    return this.repository.save(created);
  }

  async removeQrCode(userId: string): Promise<SiteSettings> {
    const existing = await this.repository.findOne({ where: {} });
    if (!existing) {
      throw new Error('Site settings not found');
    }

    logger.warn('Removing QR code from site settings', { module: 'SiteSettingsService' });

    await this.deleteFiles(existing.qrCodeLocalPath, existing.qrCodePath);

    existing.qrCodeUrl = null as any;
    existing.qrCodePath = null as any;
    existing.qrCodeLocalPath = null as any;
    existing.modifiedById = userId;

    return this.repository.save(existing);
  }

  private async deleteFiles(localPath?: string, publicId?: string): Promise<void> {
    try {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
        logger.info(`Deleted from Cloudinary: ${publicId}`, { module: 'SiteSettingsService' });
      }

      if (localPath) {
        const fullPath = path.isAbsolute(localPath)
          ? localPath
          : path.join(process.cwd(), localPath);

        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          logger.info(`Deleted from local disk: ${fullPath}`, { module: 'SiteSettingsService' });
        }
      }
    } catch (error) {
      logger.error(
        `Failed to delete associated files: ${error instanceof Error ? error.message : String(error)}`,
        { module: 'SiteSettingsService' }
      );
    }
  }
}
```

- [ ] **Step 3: Verify — type-check**

Run: `cd ict-meetup-api && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd ict-meetup-api
git add src/modules/site-settings/validators/site-settings.validator.ts src/modules/site-settings/services/site-settings.service.ts
git commit -m "feat: add site-settings validator and service"
```

---

## Task 4: `site-settings` controller, routes, and mounting

**Files:**
- Create: `ict-meetup-api/src/modules/site-settings/controllers/site-settings.controller.ts`
- Create: `ict-meetup-api/src/modules/site-settings/routes/site-settings.routes.ts`
- Modify: `ict-meetup-api/src/index.ts`

**Interfaces:**
- Consumes: `SiteSettingsService` (Task 3), `upsertSiteSettingsSchema` (Task 3), `AuditLogScope.SITE_SETTINGS` (Task 1), the `"site-settings"` upload-folder fix (Task 1).
- Produces: `GET/PUT /api/site-settings`, `DELETE /api/site-settings/qrcode` — consumed by Task 9/14 (frontend API_ROUTES).

- [ ] **Step 1: Create the controller**

Create `ict-meetup-api/src/modules/site-settings/controllers/site-settings.controller.ts`:

```ts
import { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { SiteSettingsService } from '../services/site-settings.service';
import { responseHandler } from '../../../shared/utils/helpers/response.helper';
import { BaseController } from '../../../shared/base/base.controller';
import { AuditLogActionType, AuditLogScope, AuditLogType } from '../../../shared/constants/audit-log.constants';

export class SiteSettingsController extends BaseController {
  private service: SiteSettingsService;
  protected moduleName = 'SiteSettingsService';

  constructor(dataSource: DataSource) {
    super(dataSource);
    this.service = new SiteSettingsService(dataSource);
  }

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.get();
      return responseHandler(res)('Site settings fetched successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await this.service.upsert(req.body, userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.UPDATE,
        'Site settings updated successfully',
        null,
        AuditLogScope.SITE_SETTINGS,
        req.ip,
        userId
      );
      return responseHandler(res)('Site settings updated successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  removeQrCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await this.service.removeQrCode(userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.DELETE,
        'Site settings QR code removed successfully',
        null,
        AuditLogScope.SITE_SETTINGS,
        req.ip,
        userId
      );
      return responseHandler(res)('QR code removed successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };
}
```

- [ ] **Step 2: Create the routes**

Create `ict-meetup-api/src/modules/site-settings/routes/site-settings.routes.ts`:

```ts
import { Router } from 'express';
import { DataSource } from 'typeorm';
import { SiteSettingsController } from '../controllers/site-settings.controller';
import { validateRequestBody } from '../../../shared/validators/request.validator';
import { upsertSiteSettingsSchema } from '../validators/site-settings.validator';
import { createAuthenticate } from '../../../shared/middlewares/auth.middleware';
import { imageUploadHandler } from '../../../shared/utils/helpers/imageUpload.helper';

const createSiteSettingsRouter = (dataSource: DataSource) => {
  const router = Router();
  const controller = new SiteSettingsController(dataSource);
  const authenticate = createAuthenticate(dataSource);

  /**
  * @swagger
  * /api/site-settings:
  *   get:
  *     summary: Get the global club settings (club contact, social links, payment QR code)
  *     tags: [SiteSettings]
  *     responses:
  *       200:
  *         description: OK
  */
  router.get('/', controller.get);

  /**
  * @swagger
  * /api/site-settings:
  *   put:
  *     summary: Create or update the global club settings
  *     tags: [SiteSettings]
  *     requestBody:
  *       content:
  *         multipart/form-data:
  *           schema:
  *             type: object
  *             properties:
  *               clubEmail: { type: string }
  *               clubPhoneNumber: { type: string }
  *               socialMediaLinks: { type: string, description: "JSON stringified array of {platform, link}" }
  *               qrCode:
  *                 type: string
  *                 format: binary
  *                 description: Payment QR code image
  *     responses:
  *       200:
  *         description: OK
  */
  router.put(
    '/',
    authenticate,
    imageUploadHandler({ fieldName: 'qrCode', multiple: false, optional: true }),
    validateRequestBody(upsertSiteSettingsSchema),
    controller.update
  );

  /**
  * @swagger
  * /api/site-settings/qrcode:
  *   delete:
  *     summary: Remove the payment QR code from the global club settings
  *     tags: [SiteSettings]
  *     responses:
  *       200:
  *         description: OK
  */
  router.delete('/qrcode', authenticate, controller.removeQrCode);

  return router;
};

export default createSiteSettingsRouter;
```

- [ ] **Step 3: Mount the router**

In `ict-meetup-api/src/index.ts`, find:

```ts
import createSettingsRouter from "./modules/settings/routes/settings.routes";
import createContentRouter from "./modules/content/routes/content.routes";
```

Change to:

```ts
import createSettingsRouter from "./modules/settings/routes/settings.routes";
import createSiteSettingsRouter from "./modules/site-settings/routes/site-settings.routes";
import createContentRouter from "./modules/content/routes/content.routes";
```

Then find:

```ts
    app.use("/api/settings", createSettingsRouter(connectDatabase));
    app.use("/api/content", createContentRouter(connectDatabase));
```

Change to:

```ts
    app.use("/api/settings", createSettingsRouter(connectDatabase));
    app.use("/api/site-settings", createSiteSettingsRouter(connectDatabase));
    app.use("/api/content", createContentRouter(connectDatabase));
```

- [ ] **Step 4: Verify — full CRUD cycle via curl**

Run: `cd ict-meetup-api && pnpm dev` (leave running in one terminal)

In another terminal:

```bash
curl -s http://localhost:4000/api/site-settings
```
Expected: `{"status":"success","message":"Site settings fetched successfully","data":null}`

Log in first to get an auth cookie (adjust email/password to a real admin account in your dev DB):
```bash
curl -s -c /tmp/cookies.txt -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<your-admin-email>","password":"<your-admin-password>"}'
```
Expected: a JSON success response (200), and `/tmp/cookies.txt` now contains `access_token`/`refresh_token`.

```bash
curl -s -b /tmp/cookies.txt -X PUT http://localhost:4000/api/site-settings \
  -F "clubEmail=itclub.prime@prime.edu.np" \
  -F "clubPhoneNumber=+977 9800000000"
```
Expected: `{"status":"success","message":"Site settings updated successfully","data":{...,"clubEmail":"itclub.prime@prime.edu.np","clubPhoneNumber":"+977 9800000000",...}}`

```bash
curl -s http://localhost:4000/api/site-settings
```
Expected: same data returned (no auth needed for GET).

```bash
curl -s -b /tmp/cookies.txt -X DELETE http://localhost:4000/api/site-settings/qrcode
```
Expected: `{"status":"success","message":"QR code removed successfully","data":{...,"qrCodeUrl":null,...}}` (fine even with no QR code set yet — verifies the route doesn't 404/500).

- [ ] **Step 5: Commit**

```bash
cd ict-meetup-api
git add src/modules/site-settings/controllers/site-settings.controller.ts src/modules/site-settings/routes/site-settings.routes.ts src/index.ts
git commit -m "feat: add site-settings controller, routes, and mount at /api/site-settings"
```

---

## Task 5: Shrink the `Settings` entity and validator

**Files:**
- Modify: `ict-meetup-api/src/modules/settings/entities/settings.entity.ts`
- Modify: `ict-meetup-api/src/modules/settings/validators/settings.validator.ts`

**Interfaces:**
- Produces: `Settings` entity with only `versionId`, `email`, `phoneNumber`, `contactDepartments` (plus `BaseEntity` fields) — consumed by Task 6.

- [ ] **Step 1: Rewrite the entity**

Replace the full contents of `ict-meetup-api/src/modules/settings/entities/settings.entity.ts` with:

```ts
import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/config/typeorm/base-entity';
import { FlagshipEventVersion } from '../../flagship-event/entities/flagship-event.entity';

@Entity({ name: 'settings' })
export class Settings extends BaseEntity {

  @Index()
  @Column({
    name: 'flagship_event_version_id',
    type: 'varchar',
    length: 36,
    nullable: false,
  })
  versionId: string;

  @ManyToOne(() => FlagshipEventVersion)
  @JoinColumn({ name: 'flagship_event_version_id' })
  flagshipEventVersion: FlagshipEventVersion;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ name: 'contact_departments', type: 'json', nullable: true })
  contactDepartments: { department: string; contacts: { name: string; phone: string }[] }[];
}
```

This removes `socialMediaLinks`, `teamName`, `qrCodeUrl`, `qrCodePath`, `qrCodeLocalPath`, `clubEmail`, `clubPhoneNumber`.

- [ ] **Step 2: Rewrite the validator**

Replace the full contents of `ict-meetup-api/src/modules/settings/validators/settings.validator.ts` with:

```ts
import { z } from 'zod';

const contactPersonSchema = z.object({
  name: z.string(),
  phone: z.string(),
});

const contactDepartmentSchema = z.object({
  department: z.string(),
  contacts: z.array(contactPersonSchema),
});

export const createSettingsSchema = z.object({
  versionId: z.uuid(),
  email: z.string().email().optional(),
  phoneNumber: z.string().trim().max(20).optional(),
  contactDepartments: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    },
    z.array(contactDepartmentSchema).optional()
  ),
});

export const updateSettingsSchema = createSettingsSchema.partial();

export const settingsIdParamSchema = z.object({
  id: z.uuid(),
});

export const settingsQuerySchema = z.object({
  versionId: z.uuid().optional(),
});

export type CreateSettingsDto = z.infer<typeof createSettingsSchema>;
export type UpdateSettingsDto = z.infer<typeof updateSettingsSchema>;
```

This removes the `socialMediaLinks`, `clubEmail`, `clubPhoneNumber`, `teamName`, `qrCodeUrl`, `qrCodePath`, `qrCodeLocalPath`, `uploadedImages` fields (no more file upload on this schema — Contact Management never had one) and the now-unused `SocialMediaPlatform` enum / `socialMediaLinkSchema`.

- [ ] **Step 3: Verify — type-check (expect errors, that's the point)**

Run: `cd ict-meetup-api && npx tsc --noEmit`
Expected: **errors** in `settings.service.ts` and `settings.controller.ts` (they still reference the removed fields) and in `event-registration.service.ts` (still reads `settings.clubEmail` etc). This is expected — Task 6 and Task 7 fix these. Confirm the errors are only in those three files, nowhere else.

- [ ] **Step 4: Commit**

```bash
cd ict-meetup-api
git add src/modules/settings/entities/settings.entity.ts src/modules/settings/validators/settings.validator.ts
git commit -m "refactor: shrink Settings entity/validator to only Contact Management fields"
```

---

## Task 6: Shrink `SettingsController`/`SettingsService`, update routes

**Files:**
- Modify: `ict-meetup-api/src/modules/settings/controllers/settings.controller.ts`
- Modify: `ict-meetup-api/src/modules/settings/services/settings.service.ts`
- Modify: `ict-meetup-api/src/modules/settings/routes/settings.routes.ts`

**Interfaces:**
- Consumes: shrunk `Settings` entity/validator (Task 5).
- Produces: `GET /api/settings/contacts` now returns only `email`, `phoneNumber`, `contactDepartments`; `getSocialMedia`/`getPayments`/`removeQrCode` are gone.

- [ ] **Step 1: Rewrite the controller**

Replace the full contents of `ict-meetup-api/src/modules/settings/controllers/settings.controller.ts` with:

```ts
import { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { SettingsService } from '../services/settings.service';
import { responseHandler } from '../../../shared/utils/helpers/response.helper';
import { BaseController } from '../../../shared/base/base.controller';
import { AuditLogActionType, AuditLogScope, AuditLogType } from '../../../shared/constants/audit-log.constants';

export class SettingsController extends BaseController {
  private service: SettingsService;
  protected moduleName = 'SettingsService';

  constructor(dataSource: DataSource) {
    super(dataSource);
    this.service = new SettingsService(dataSource);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await this.service.create(req.body, userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.CREATE,
        "Settings created successfully",
        result.versionId,
        AuditLogScope.SETTINGS,
        req.ip,
        userId
      );
      return responseHandler(res)(
        'Settings created successfully',
        result,
        201
      );
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findAll(req.query);
      return responseHandler(res)(
        'Settings fetched successfully',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  getContacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { versionId } = req.query as { versionId: string };
      const settings = await this.service.findByVersion(versionId);
      if (!settings) {
        return responseHandler(res)('No settings found for this version', null, 404);
      }
      return responseHandler(res)('Contact settings fetched successfully', {
        email: settings.email,
        phoneNumber: settings.phoneNumber,
        contactDepartments: settings.contactDepartments,
      }, 200);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findById(req.params.id);
      return responseHandler(res)(
        'Settings fetched successfully',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await this.service.update(
        req.params.id,
        req.body,
        userId
      );
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.UPDATE,
        "Settings updated successfully",
        result.versionId,
        AuditLogScope.SETTINGS,
        req.ip,
        userId
      );
      return responseHandler(res)(
        'Settings updated successfully',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const settings = await this.service.findById(req.params.id);
      await this.service.delete(req.params.id, userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.DELETE,
        "Settings deleted successfully",
        settings.versionId,
        AuditLogScope.SETTINGS,
        req.ip,
        userId
      );
      return responseHandler(res)('Settings deleted successfully', null, 200);
    } catch (error) {
      next(error);
    }
  };
}
```

This removes `getSocialMedia`, `getPayments`, `removeQrCode`.

- [ ] **Step 2: Rewrite the service**

Replace the full contents of `ict-meetup-api/src/modules/settings/services/settings.service.ts` with:

```ts
import { DataSource, EntityManager, Repository } from 'typeorm';
import { AppError } from '../../../shared/utils/error.utils';
import logger from '../../../shared/utils/logger.utils';
import { Settings } from '../entities/settings.entity';
import { CreateSettingsDto, UpdateSettingsDto } from '../validators/settings.validator';
import { FlagshipEventVersion, EventVersionStatus } from '../../flagship-event/entities/flagship-event.entity';

export class SettingsService {
  private settingsRepository: Repository<Settings>;
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.settingsRepository = dataSource.getRepository(Settings);
  }

  async create(data: CreateSettingsDto, userId: string): Promise<Settings> {
    logger.info(`Creating new settings`, {
      module: 'SettingsService',
    });

    const versionExists = await this.dataSource
      .getRepository(FlagshipEventVersion)
      .findOne({ where: { id: data.versionId } });

    if (!versionExists) {
      throw new AppError('Flagship event version not found', 404);
    }

    if (versionExists.status === EventVersionStatus.ARCHIVED) {
      throw new AppError('Cannot create settings for an archived flagship event version', 400);
    }

    const existing = await this.settingsRepository.findOne({
      where: { versionId: data.versionId },
    });

    if (existing) {
      throw new AppError(
        `Settings already exist for this flagship event version`,
        400
      );
    }

    const payload = {
      ...data,
      createdById: userId
    };

    const newSettings = this.settingsRepository.create(payload);
    const savedSettings = await this.settingsRepository.save(newSettings);

    return savedSettings;
  }

  async findAll(query: any = {}): Promise<any> {
    logger.debug('Fetching all settings', {
      module: 'SettingsService',
      query,
    });

    const { versionId, page = 1, limit = 10 } = query;
    const where = versionId ? { versionId } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await this.settingsRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: Number(limit),
      relations: ['flagshipEventVersion'],
    });

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      }
    };
  }

  async findByVersion(versionId: string): Promise<Settings | null> {
    return this.settingsRepository.findOne({
      where: { versionId },
      relations: ['flagshipEventVersion'],
    });
  }

  async findById(id: string): Promise<Settings> {
    const settings = await this.settingsRepository.findOne({
      where: { id },
      relations: ['flagshipEventVersion'],
    });
    if (!settings) {
      throw new AppError('Settings not found', 404);
    }
    return settings;
  }

  async update(
    id: string,
    data: UpdateSettingsDto,
    userId: string
  ): Promise<Settings> {
    const settings = await this.findById(id);

    logger.info(`Updating settings: ${id}`, {
      module: 'SettingsService',
    });

    const versionId = data.versionId || settings.versionId;
    const versionExists = await this.dataSource
      .getRepository(FlagshipEventVersion)
      .findOne({ where: { id: versionId } });

    if (!versionExists) {
      throw new AppError('Flagship event version not found', 404);
    }

    if (versionExists.status === EventVersionStatus.ARCHIVED) {
      throw new AppError('Cannot update settings for an archived flagship event version', 400);
    }

    if (data.versionId && data.versionId !== settings.versionId) {
      const duplicate = await this.settingsRepository.findOne({
        where: { versionId: data.versionId },
      });
      if (duplicate) {
        throw new AppError(
          `Settings already exist for this flagship event version`,
          400
        );
      }
    }

    // Keep the loaded relation in sync with the new FK — TypeORM writes the
    // join column from this relation on save, so a stale relation here would
    // silently overwrite the versionId we're about to assign below.
    settings.flagshipEventVersion = versionExists;

    // Filter out undefined properties from data so they don't overwrite existing settings
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    Object.assign(settings, cleanData, { modifiedById: userId });
    const updatedSettings = await this.settingsRepository.save(settings);

    return updatedSettings;
  }

  async delete(id: string, userId: string): Promise<void> {
    const settings = await this.findById(id);

    logger.warn(`Deleting settings: ${id}`, {
      module: 'SettingsService',
    });

    if (settings.flagshipEventVersion.status !== EventVersionStatus.DRAFT) {
      throw new AppError('Can only delete settings for a flagship event version that is in "draft" status', 400);
    }

    await this.settingsRepository.remove(settings);

    return;
  }

  // Delete the settings row belonging to a version (cascade on version delete).
  // Pass `manager` to run inside the version-delete transaction.
  async deleteByVersion(versionId: string, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(Settings) : this.settingsRepository;
    const rows = await repo.find({ where: { versionId } });
    if (!rows.length) return;

    logger.warn(`Deleting settings for version ${versionId}`, {
      module: 'SettingsService',
    });

    await repo.remove(rows);
  }
}
```

This removes `removeQrCode`, `deleteFiles`, and all QR/Cloudinary lifecycle logic (no file field lives on this entity anymore), and the now-unused `fs`/`path`/`cloudinary` imports.

Check whether `deleteByVersion` is called anywhere expecting the old Cloudinary cleanup behavior:

Run: `cd ict-meetup-api && grep -rn "deleteByVersion" src --include="*.ts"`
Expected: one call site (likely in the flagship-event version delete flow) — confirm it just calls `settingsService.deleteByVersion(versionId, manager)` with no other expectations; no code change needed there since the method signature is unchanged.

- [ ] **Step 3: Rewrite the routes**

Replace the full contents of `ict-meetup-api/src/modules/settings/routes/settings.routes.ts` with:

```ts
import { Router } from 'express';
import { DataSource } from 'typeorm';
import { SettingsController } from '../controllers/settings.controller';
import { validateRequestBody, validateRequestQuery, validateRequestParams } from '../../../shared/validators/request.validator';
import {
  createSettingsSchema,
  updateSettingsSchema,
  settingsQuerySchema,
  settingsIdParamSchema,
} from '../validators/settings.validator';
import { createAuthenticate } from '../../../shared/middlewares/auth.middleware';
import { z } from 'zod';

const versionIdQuerySchema = z.object({ versionId: z.string().uuid() });

const createSettingsRouter = (dataSource: DataSource) => {
  const router = Router();
  const controller = new SettingsController(dataSource);
  const authenticate = createAuthenticate(dataSource);

  /**
  * @swagger
  * /api/settings:
  *   post:
  *     summary: Create a new settings record
  *     tags: [Settings]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [versionId]
  *             properties:
  *               versionId: { type: string, format: uuid }
  *               email: { type: string }
  *               phoneNumber: { type: string }
  *               contactDepartments: { type: string, description: "JSON stringified array of {department, contacts}" }
  *     responses:
  *       201:
  *         description: Created
  */
  router.post('/', authenticate, validateRequestBody(createSettingsSchema), controller.create);

  /**
  * @swagger
  * /api/settings:
  *   get:
  *     summary: Get all settings
  *     tags: [Settings]
  *     parameters:
  *       - in: query
  *         name: versionId
  *         schema: { type: string, format: uuid }
  *     responses:
  *       200:
  *         description: OK
  */
  router.get('/', validateRequestQuery(settingsQuerySchema), controller.getAll);

  /**
  * @swagger
  * /api/settings/contacts:
  *   get:
  *     summary: Get contact info (email, phone, department contacts) for a version
  *     tags: [Settings]
  *     parameters:
  *       - in: query
  *         name: versionId
  *         required: true
  *         schema: { type: string, format: uuid }
  *     responses:
  *       200:
  *         description: OK
  */
  router.get('/contacts', validateRequestQuery(versionIdQuerySchema), controller.getContacts);

  /**
  * @swagger
  * /api/settings/{id}:
  *   get:
  *     summary: Get settings by ID
  *     tags: [Settings]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema: { type: string, format: uuid }
  *     responses:
  *       200:
  *         description: OK
  */
  router.get('/:id', validateRequestParams(settingsIdParamSchema), controller.getById);

  /**
  * @swagger
  * /api/settings/{id}:
  *   put:
  *     summary: Update settings
  *     tags: [Settings]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema: { type: string, format: uuid }
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               versionId: { type: string, format: uuid }
  *               email: { type: string }
  *               phoneNumber: { type: string }
  *               contactDepartments: { type: string, description: "JSON stringified array of {department, contacts}" }
  *     responses:
  *       200:
  *         description: OK
  */
  router.put('/:id', authenticate, validateRequestParams(settingsIdParamSchema), validateRequestBody(updateSettingsSchema), controller.update);

  /**
  * @swagger
  * /api/settings/{id}:
  *   delete:
  *     summary: Delete settings record
  *     tags: [Settings]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema: { type: string, format: uuid }
  *     responses:
  *       200:
  *         description: OK
  */
  router.delete('/:id', authenticate, validateRequestParams(settingsIdParamSchema), controller.delete);

  return router;
};

export default createSettingsRouter;
```

Note `POST`/`PUT` no longer go through `imageUploadHandler` (Contact Management never uploaded a file — only Payment Setup did, and that's now on `site-settings`), and the `/social-media`, `/payments`, `/:id/qrcode` routes are gone.

- [ ] **Step 4: Verify — type-check, then exercise Contact Management's routes**

Run: `cd ict-meetup-api && npx tsc --noEmit`
Expected: no errors remaining in `settings.controller.ts`/`settings.service.ts`/`settings.routes.ts` (Task 7 will clear the last remaining error in `event-registration.service.ts`).

Run: `cd ict-meetup-api && pnpm dev`, then in another terminal (reuse `/tmp/cookies.txt` from Task 4, and substitute a real `versionId` from your dev DB — get one via `curl -s http://localhost:4000/api/flagship-event/versions`):

```bash
curl -s -b /tmp/cookies.txt -X POST http://localhost:4000/api/settings \
  -H "Content-Type: application/json" \
  -d '{"versionId":"<a-real-version-id>","email":"contact@ictmeetup.com","phoneNumber":"+977 9800000001","contactDepartments":[{"department":"Technical","contacts":[{"name":"Test Person","phone":"9800000002"}]}]}'
```
Expected: `{"status":"success","message":"Settings created successfully","data":{...}}` with no `clubEmail`/`socialMediaLinks`/`qrCodeUrl` keys in the response.

```bash
curl -s "http://localhost:4000/api/settings/contacts?versionId=<same-version-id>"
```
Expected: `{"status":"success","message":"Contact settings fetched successfully","data":{"email":"contact@ictmeetup.com","phoneNumber":"+977 9800000001","contactDepartments":[...]}}` — no `clubEmail`/`clubPhoneNumber` keys.

```bash
curl -s "http://localhost:4000/api/settings/social-media?versionId=<same-version-id>"
curl -s "http://localhost:4000/api/settings/payments?versionId=<same-version-id>"
```
Expected: both return a 404 (route not found), confirming they're gone.

- [ ] **Step 5: Commit**

```bash
cd ict-meetup-api
git add src/modules/settings/controllers/settings.controller.ts src/modules/settings/services/settings.service.ts src/modules/settings/routes/settings.routes.ts
git commit -m "refactor: remove social-media/payments/QR-code endpoints from settings module"
```

---

## Task 7: Point registration emails at the new global settings

**Files:**
- Modify: `ict-meetup-api/src/modules/event-registration/services/event-registration.service.ts:1-41`

**Interfaces:**
- Consumes: `SiteSettingsService.get()` (Task 3).
- Produces: `getClubInfo` still returns the same `ClubInfo` shape `mail.service.ts` expects — no change needed there.

- [ ] **Step 1: Swap the `Settings` repository for `SiteSettingsService` in the constructor**

In `ict-meetup-api/src/modules/event-registration/services/event-registration.service.ts`, find:

```ts
import { EventRegistration, EventRegistrationStatus } from "../entities/event-registration.entity";
import { DataSource, Repository } from "typeorm";
import { EventVersionStatus, FlagshipEventVersion } from "../../flagship-event/entities/flagship-event.entity";
import { Event, EventStatus } from "../../event/entities/event.entity";
import { CreateEventRegistrationDto } from "../validators/event-registration.validator";
import { AppError } from "../../../shared/utils/error.utils";
import { removeFile } from "../../../shared/utils/helpers/imageUpload.helper";
import { mailService, ClubInfo } from "../../mail/mail.service";
import { Settings } from "../../settings/entities/settings.entity";
import { HeroSection } from "../../hero-sections/entities/hero-section.entity";
import { randomUUID } from "crypto";

export class EventRegistrationService {
      private eventRegistrationRepository: Repository<EventRegistration>;
      private flagshipEventVersionRepository: Repository<FlagshipEventVersion>;
      private eventRepository: Repository<Event>;
      private settingsRepository: Repository<Settings>;
      private heroSectionRepository: Repository<HeroSection>;
      constructor(dataSources: DataSource) {
            this.eventRegistrationRepository = dataSources.getRepository(EventRegistration);
            this.flagshipEventVersionRepository = dataSources.getRepository(FlagshipEventVersion);
            this.eventRepository = dataSources.getRepository(Event);
            this.settingsRepository = dataSources.getRepository(Settings);
            this.heroSectionRepository = dataSources.getRepository(HeroSection);
      }

      private async getClubInfo(versionId: string, version: FlagshipEventVersion): Promise<ClubInfo> {
            const [settings, hero] = await Promise.all([
                  this.settingsRepository.findOne({ where: { versionId } }),
                  this.heroSectionRepository.findOne({ where: { flagshipEventVersionId: versionId } }),
            ]);
            return {
                  versionName: version?.version_name ?? "ICT Meetup",
                  logoUrl: version?.logo ?? null,
                  heroTitle: hero?.heading ?? null,
                  heroDescription: hero?.paragraph ?? null,
                  clubEmail: settings?.clubEmail ?? settings?.email ?? null,
                  clubPhoneNumber: settings?.clubPhoneNumber ?? settings?.phoneNumber ?? null,
                  socialMediaLinks: settings?.socialMediaLinks ?? null,
            };
      }
```

Replace with:

```ts
import { EventRegistration, EventRegistrationStatus } from "../entities/event-registration.entity";
import { DataSource, Repository } from "typeorm";
import { EventVersionStatus, FlagshipEventVersion } from "../../flagship-event/entities/flagship-event.entity";
import { Event, EventStatus } from "../../event/entities/event.entity";
import { CreateEventRegistrationDto } from "../validators/event-registration.validator";
import { AppError } from "../../../shared/utils/error.utils";
import { removeFile } from "../../../shared/utils/helpers/imageUpload.helper";
import { mailService, ClubInfo } from "../../mail/mail.service";
import { SiteSettingsService } from "../../site-settings/services/site-settings.service";
import { HeroSection } from "../../hero-sections/entities/hero-section.entity";
import { randomUUID } from "crypto";

export class EventRegistrationService {
      private eventRegistrationRepository: Repository<EventRegistration>;
      private flagshipEventVersionRepository: Repository<FlagshipEventVersion>;
      private eventRepository: Repository<Event>;
      private siteSettingsService: SiteSettingsService;
      private heroSectionRepository: Repository<HeroSection>;
      constructor(dataSources: DataSource) {
            this.eventRegistrationRepository = dataSources.getRepository(EventRegistration);
            this.flagshipEventVersionRepository = dataSources.getRepository(FlagshipEventVersion);
            this.eventRepository = dataSources.getRepository(Event);
            this.siteSettingsService = new SiteSettingsService(dataSources);
            this.heroSectionRepository = dataSources.getRepository(HeroSection);
      }

      private async getClubInfo(versionId: string, version: FlagshipEventVersion): Promise<ClubInfo> {
            const [siteSettings, hero] = await Promise.all([
                  this.siteSettingsService.get(),
                  this.heroSectionRepository.findOne({ where: { flagshipEventVersionId: versionId } }),
            ]);
            return {
                  versionName: version?.version_name ?? "ICT Meetup",
                  logoUrl: version?.logo ?? null,
                  heroTitle: hero?.heading ?? null,
                  heroDescription: hero?.paragraph ?? null,
                  clubEmail: siteSettings?.clubEmail ?? null,
                  clubPhoneNumber: siteSettings?.clubPhoneNumber ?? null,
                  socialMediaLinks: siteSettings?.socialMediaLinks ?? null,
            };
      }
```

`mail.service.ts` needs no changes — its `ClubInfo` interface is unchanged and it never touched the `Settings` entity directly.

- [ ] **Step 2: Verify — type-check clean**

Run: `cd ict-meetup-api && npx tsc --noEmit`
Expected: no errors anywhere now (this was the last file with a dangling reference to the removed `Settings` fields).

- [ ] **Step 3: Verify — a real registration email picks up global club info**

With `pnpm dev` running and `/api/site-settings` already populated from Task 4's verification (`clubEmail: itclub.prime@prime.edu.np`), submit a real registration through the running frontend (`ict-frontend`'s register flow) for any free event, or via curl against `POST /api/event-registrations` with a real `eventId`/`versionId`. Then check the server logs for `[MailQueue] Job failed:` — if that line does NOT appear, the mail queue processed the job without error (actual delivery depends on `MAIL_USER`/`MAIL_PASSWORD` being configured in `.env`; if they aren't set up in your dev environment, confirm instead that no exception is thrown and move on — this is a non-blocking manual check).

- [ ] **Step 4: Commit**

```bash
cd ict-meetup-api
git add src/modules/event-registration/services/event-registration.service.ts
git commit -m "refactor: source registration email club info from global site-settings"
```

---

## Task 8: Generate and review a migration for non-local environments

**Files:**
- Create: a new file under `ict-meetup-api/src/shared/config/typeorm/migrations/` (name assigned by the generator).

**Interfaces:**
- Consumes: all entity changes from Tasks 2 and 5.
- Produces: a reviewed migration file ready to run against `dev`/`prod`.

- [ ] **Step 1: Generate the migration**

With the dev DB reachable and `pnpm dev` **stopped** (so nothing else is holding a connection), run:

```bash
cd ict-meetup-api
npm run typeorm:generate-migration --name=NonVersionedSiteSettings
```

Expected: a new file appears at `src/shared/config/typeorm/migrations/<timestamp>-NonVersionedSiteSettings.ts`.

- [ ] **Step 2: Review the generated SQL**

Open the generated migration file and confirm the `up()` method contains, at minimum:
- A `CREATE TABLE \`site_settings\`` statement with columns matching Task 2's entity.
- An `ALTER TABLE \`settings\` DROP COLUMN` statement for each of: `social_media_links`, `email`... — **wait, `email`/`phone_number`/`contact_departments` must NOT be dropped** (those stay on `Settings`). Confirm only `club_email`, `club_phone_number`, `social_media_links`, `qr_code_url`, `qr_code_path`, `qr_code_local_path`, `team_name` are in the `DROP COLUMN` statements — if `email`, `phone_number`, or `contact_departments` appear in a `DROP COLUMN` statement, something is wrong upstream in Task 5's entity and must be fixed before proceeding.

If the DB you generated against had already been running with `synchronize: true` through Tasks 1-7 (which it will have, per the Global Constraints), the generated migration may come back nearly empty because the schema already matches the entities. In that case, note in the migration's comment or in your PR description that schema sync already applied these changes locally, and this migration exists purely so `dev`/`prod` (which don't run `synchronize`) get the same DDL applied through the normal migration pipeline.

- [ ] **Step 3: Do not run it locally**

This migration is for `dev`/`prod` deploys, not for local verification (local already has the table via `synchronize`). Do not run `pnpm typeorm:run-migrations` against your local dev DB as part of this task — running it is the responsibility of whoever deploys to `dev`/`prod`.

- [ ] **Step 4: Commit**

```bash
cd ict-meetup-api
git add src/shared/config/typeorm/migrations/
git commit -m "chore: add migration for site_settings table and settings column removal"
```

---

## Task 9: Admin — split `types/settings.ts`, add API routes

**Files:**
- Modify: `ict-meetup-admin/src/types/settings.ts`
- Modify: `ict-meetup-admin/src/lib/api-routes.ts`

**Interfaces:**
- Produces: `Settings` type (Contact Management only), new `SiteSettings` type — consumed by Task 10-13.

- [ ] **Step 1: Rewrite `types/settings.ts`**

Replace the full contents of `ict-meetup-admin/src/types/settings.ts` with:

```ts
import type { FlagshipEventVersion } from "./version";

/** Allowed social platforms — case-sensitive, enforced by the backend. */
export const SOCIAL_PLATFORMS = [
  "Facebook",
  "Instagram",
  "LinkedIn",
  "Twitter",
  "TikTok",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export interface SocialMediaLink {
  platform: SocialPlatform;
  link: string;
}

export interface ContactPerson {
  name: string;
  phone: string;
}

export interface ContactDepartment {
  department: string;
  contacts: ContactPerson[];
}

/** Per-version contact settings (Contact Management tab). At most one per version. */
export interface Settings {
  id: string;
  versionId: string;
  email: string | null;
  phoneNumber: string | null;
  contactDepartments: ContactDepartment[] | null;
  flagshipEventVersion?: FlagshipEventVersion;
  createdAt: string;
  updatedAt: string;
}

/** Global, non-versioned club settings (Club Details, Social Media, Payment Setup tabs). Always at most one row. */
export interface SiteSettings {
  id: string;
  clubEmail: string | null;
  clubPhoneNumber: string | null;
  socialMediaLinks: SocialMediaLink[] | null;
  /** Cloudinary URL — use this to display the QR code. */
  qrCodeUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
```

- [ ] **Step 2: Add API route entries**

In `ict-meetup-admin/src/lib/api-routes.ts`, find:

```ts
  // ─── Settings ─────────────────────────────────────────────────────────────
  // Unified per-version settings record (contact, social links, QR code).
  settings: "/settings",
  settingDetail: "/settings/${id}",
  settingQrCode: "/settings/${id}/qrcode",
} as const;
```

Change to:

```ts
  // ─── Settings ─────────────────────────────────────────────────────────────
  // Per-version Contact Management record (email, phone, department contacts).
  settings: "/settings",
  settingDetail: "/settings/${id}",

  // ─── Site Settings ────────────────────────────────────────────────────────
  // Global, non-versioned record (club contact, social links, payment QR code).
  siteSettings: "/site-settings",
  siteSettingsQrCode: "/site-settings/qrcode",
} as const;
```

- [ ] **Step 3: Verify — type-check**

Run: `cd ict-meetup-admin && npx tsc --noEmit -p tsconfig.app.json`
Expected: errors in `ClubDetails.tsx`, `SocialMediaProfile.tsx`, `PaymentSetup.tsx` (they still reference `clubEmail`/`socialMediaLinks`/`qrCodeUrl` on the now-narrower `Settings` type, and `settingQrCode` which no longer exists). This is expected — Tasks 11-13 fix these. Confirm no errors appear in `ContactManagement.tsx` (it only ever used `email`/`phoneNumber`/`contactDepartments`, which are unchanged).

- [ ] **Step 4: Commit**

```bash
cd ict-meetup-admin
git add src/types/settings.ts src/lib/api-routes.ts
git commit -m "refactor: split Settings/SiteSettings types, add site-settings API routes"
```

---

## Task 10: Admin — `useSiteSettings` hook

**Files:**
- Create: `ict-meetup-admin/src/pages/settings/use-site-settings.ts`

**Interfaces:**
- Consumes: `API_ROUTES.siteSettings`/`siteSettingsQrCode` (Task 9), `SiteSettings` type (Task 9).
- Produces: `useSiteSettings()` returning `{ settings, isLoading, exists, save, isSaving, removeQrCode, isRemovingQrCode, refetch }` — consumed by Tasks 11-13.

- [ ] **Step 1: Create the hook**

Create `ict-meetup-admin/src/pages/settings/use-site-settings.ts`:

```ts
import toast from "react-hot-toast";
import { useApiQuery } from "../../lib";
import { useApiMutation } from "../../lib/use-api-mutation";
import type { SiteSettings } from "../../types/settings";

/**
 * Loads and saves the single global site-settings record (Club Details,
 * Social Media, Payment Setup tabs). There is no version picker here —
 * unlike Contact Management, this data is not versioned.
 */
export function useSiteSettings() {
  const { data, isLoading, refetch } = useApiQuery("siteSettings")<{
    data: SiteSettings | null;
  }>();

  const settings = data?.data ?? null;

  const { execute: putSettings, isLoading: isSaving } = useApiMutation(
    "siteSettings",
  )<{ data: SiteSettings }, FormData>({
    method: "PUT",
    invalidateRoutes: ["siteSettings"],
    onSuccess: () => {
      toast.success("Settings saved");
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to save settings"),
  });

  const { execute: removeQrCode, isLoading: isRemovingQrCode } = useApiMutation(
    "siteSettingsQrCode",
  )<{ data: SiteSettings }, never>({
    method: "DELETE",
    invalidateRoutes: ["siteSettings"],
    onSuccess: () => {
      toast.success("QR code removed");
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to remove QR code"),
  });

  const save = async (build: (fd: FormData) => void) => {
    const formData = new FormData();
    build(formData);
    await putSettings(formData);
  };

  return {
    settings,
    exists: !!settings,
    isLoading,
    save,
    isSaving,
    removeQrCode,
    isRemovingQrCode,
    refetch,
  };
}
```

- [ ] **Step 2: Verify — type-check**

Run: `cd ict-meetup-admin && npx tsc --noEmit -p tsconfig.app.json`
Expected: no new errors introduced by this file (the three pre-existing errors from Task 9 remain until Tasks 11-13).

- [ ] **Step 3: Commit**

```bash
cd ict-meetup-admin
git add src/pages/settings/use-site-settings.ts
git commit -m "feat: add useSiteSettings hook for the global settings record"
```

---

## Task 11: Admin — rewrite Club Details as a single form

**Files:**
- Modify: `ict-meetup-admin/src/pages/settings/ClubDetails.tsx`

**Interfaces:**
- Consumes: `useSiteSettings()` (Task 10).

- [ ] **Step 1: Rewrite the page**

Replace the full contents of `ict-meetup-admin/src/pages/settings/ClubDetails.tsx` with:

```tsx
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Save } from "lucide-react";
import FormInput from "../../components/form-field/input-field/InputController";
import Divider from "../../shared/design-components/divider/Divider";
import { Text } from "../../shared/design-components";
import { useSiteSettings } from "./use-site-settings";

interface ClubDetailsFormValues {
  clubEmail: string;
  clubPhoneNumber: string;
}

export default function ClubDetails() {
  const { settings, isLoading, save, isSaving } = useSiteSettings();

  const methods = useForm<ClubDetailsFormValues>({
    defaultValues: { clubEmail: "", clubPhoneNumber: "" },
  });
  const { handleSubmit, reset } = methods;

  // Pre-fill the form once the singleton record loads.
  useEffect(() => {
    if (settings) {
      reset({
        clubEmail: settings.clubEmail || "",
        clubPhoneNumber: settings.clubPhoneNumber || "",
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: ClubDetailsFormValues) => {
    await save((fd) => {
      fd.append("clubEmail", data.clubEmail.trim());
      fd.append("clubPhoneNumber", data.clubPhoneNumber.trim());
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg w-full shadow-sm">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-medium">Club Details</h2>
        <Text size="sm" variant="muted">
          The club's official contact email and phone number, shown across the whole site.
        </Text>
      </div>

      <Divider />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                name="clubEmail"
                label="Club Email"
                type="email"
                placeholder="club@prime.edu.np"
                rules={{
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                }}
              />
              <FormInput
                name="clubPhoneNumber"
                label="Club Phone Number"
                placeholder="+977 98XXXXXXXX"
                rules={{
                  maxLength: { value: 20, message: "Max 20 characters" },
                }}
              />
            </div>
          </div>

          <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border bg-surface px-6 py-4">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Save size={16} />
              )}
              <span>Save</span>
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
```

- [ ] **Step 2: Verify — type-check**

Run: `cd ict-meetup-admin && npx tsc --noEmit -p tsconfig.app.json`
Expected: no more errors in `ClubDetails.tsx`.

- [ ] **Step 3: Verify — manual browser check**

Run: `cd ict-meetup-admin && yarn dev`, log in, navigate to `/settings/club-details`.
Expected: a single form (no version dropdown, no table) with Club Email/Club Phone Number fields. Enter values, click Save — a "Settings saved" toast appears, and reloading the page shows the same values pre-filled.

- [ ] **Step 4: Commit**

```bash
cd ict-meetup-admin
git add src/pages/settings/ClubDetails.tsx
git commit -m "refactor: Club Details is now a single global form, no version picker"
```

---

## Task 12: Admin — rewrite Social Media Profile as a single form

**Files:**
- Modify: `ict-meetup-admin/src/pages/settings/SocialMediaProfile.tsx`

**Interfaces:**
- Consumes: `useSiteSettings()` (Task 10).

- [ ] **Step 1: Rewrite the page**

Replace the full contents of `ict-meetup-admin/src/pages/settings/SocialMediaProfile.tsx` with:

```tsx
import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Plus, Save, Trash2 } from "lucide-react";
import FormInput from "../../components/form-field/input-field/InputController";
import FormSelect from "../../components/form-field/input-select/SelectController";
import Divider from "../../shared/design-components/divider/Divider";
import { Text } from "../../shared/design-components";
import { useSiteSettings } from "./use-site-settings";
import { SOCIAL_PLATFORMS, type SocialPlatform } from "../../types/settings";

interface SocialFormValues {
  links: { platform: SocialPlatform | ""; link: string }[];
}

const platformOptions = SOCIAL_PLATFORMS.map((p) => ({ label: p, value: p }));

const urlRule = {
  required: "Link is required",
  pattern: { value: /^https?:\/\/.+/, message: "Must be a valid URL" },
};

export default function SocialMediaProfile() {
  const { settings, isLoading, save, isSaving } = useSiteSettings();

  const methods = useForm<SocialFormValues>({
    defaultValues: { links: [] },
  });
  const { control, handleSubmit, reset } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: "links" });

  useEffect(() => {
    if (settings) {
      reset({ links: settings.socialMediaLinks || [] });
    }
  }, [settings, reset]);

  const onSubmit = async (data: SocialFormValues) => {
    const links = data.links
      .filter((l) => l.platform && l.link.trim())
      .map((l) => ({ platform: l.platform, link: l.link.trim() }));

    await save((fd) => {
      fd.append("socialMediaLinks", JSON.stringify(links));
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg w-full shadow-sm">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-medium">Social Media Profile</h2>
        <Text size="sm" variant="muted">
          Social links shown in the footer across the whole site.
        </Text>
      </div>

      <Divider />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            {fields.length === 0 && (
              <Text size="sm" variant="muted">
                No social links yet. Add one below.
              </Text>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-[12rem_1fr_auto] gap-4 items-start"
              >
                <FormSelect
                  name={`links.${index}.platform`}
                  label="Platform"
                  options={platformOptions}
                  rules={{ required: "Required" }}
                />
                <FormInput
                  name={`links.${index}.link`}
                  label="Link"
                  placeholder="https://instagram.com/ictmeetup"
                  rules={urlRule}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-7 inline-flex items-center justify-center rounded-lg p-2 text-red-500 hover:bg-red-500/10 transition-colors"
                  aria-label="Remove link"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ platform: "", link: "" })}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:border-accent hover:text-foreground transition-colors"
            >
              <Plus size={16} />
              Add social link
            </button>
          </div>

          <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border bg-surface px-6 py-4">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Save size={16} />
              )}
              <span>Save</span>
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
```

- [ ] **Step 2: Verify — type-check**

Run: `cd ict-meetup-admin && npx tsc --noEmit -p tsconfig.app.json`
Expected: no more errors in `SocialMediaProfile.tsx`.

- [ ] **Step 3: Verify — manual browser check**

Navigate to `/settings/social-media-profile`.
Expected: single form (no version dropdown, no table), add a social link (e.g. Facebook, `https://facebook.com/test`), Save — toast confirms, reload shows the link still there.

- [ ] **Step 4: Commit**

```bash
cd ict-meetup-admin
git add src/pages/settings/SocialMediaProfile.tsx
git commit -m "refactor: Social Media Profile is now a single global form, no version picker"
```

---

## Task 13: Admin — rewrite Payment Setup as a single form

**Files:**
- Modify: `ict-meetup-admin/src/pages/settings/PaymentSetup.tsx`

**Interfaces:**
- Consumes: `useSiteSettings()` (Task 10).

- [ ] **Step 1: Rewrite the page**

Replace the full contents of `ict-meetup-admin/src/pages/settings/PaymentSetup.tsx` with:

```tsx
import { useState } from "react";
import { Trash2, Save } from "lucide-react";
import FormFileUpload from "../../components/form-field/FormFileUpload";
import Divider from "../../shared/design-components/divider/Divider";
import { Text } from "../../shared/design-components";
import { useSiteSettings } from "./use-site-settings";

export default function PaymentSetup() {
  const { settings, exists, isLoading, save, isSaving, removeQrCode, isRemovingQrCode } =
    useSiteSettings();

  const [qrFile, setQrFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file === null) {
      setQrFile(null);
      setUploadedPreview(null);
      return;
    }
    setQrFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setUploadedPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!qrFile) return;
    await save((fd) => fd.append("qrCode", qrFile));
    setQrFile(null);
    setUploadedPreview(null);
  };

  const handleRemove = async () => {
    await removeQrCode();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg w-full shadow-sm">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-medium">Payment Setup</h2>
        <Text size="sm" variant="muted">
          The QR code shown for event payments across the whole site.
        </Text>
      </div>

      <Divider />

      <div className="p-6 space-y-4">
        <FormFileUpload
          name="qrCode"
          label="QR Code"
          accept="image/*"
          preview={uploadedPreview}
          onFileChange={handleFileChange}
          title="Drop the QR code image here"
          hint="SVG, PNG, or JPG · max 2 MB"
        />

        {exists && settings?.qrCodeUrl && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isRemovingQrCode}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
            Remove QR code
          </button>
        )}

        {settings?.qrCodeUrl && (
          <div className="pt-2">
            <Divider />
            <div className="pt-4 space-y-2">
              <Text size="sm" variant="muted">Saved QR Code</Text>
              <div className="rounded-lg border border-border p-4 flex justify-center">
                <img
                  src={settings.qrCodeUrl}
                  alt="Saved QR Code"
                  className="h-40 w-40 object-contain rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border bg-surface px-6 py-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !qrFile}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <Save size={16} />
          )}
          <span>{exists ? "Save QR code" : "Create with QR code"}</span>
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify — type-check**

Run: `cd ict-meetup-admin && npx tsc --noEmit -p tsconfig.app.json`
Expected: **zero errors across the whole project** — this was the last file referencing removed fields/routes.

- [ ] **Step 3: Verify — manual browser check**

Navigate to `/settings/payment-setup`.
Expected: single form (no version dropdown, no table), upload a QR image, Save — toast confirms, reload shows the saved QR code image. Click "Remove QR code" — image disappears, toast confirms.

Also revisit `/settings/contact-management` and confirm it's **unchanged**: version dropdown still present, table of per-version rows still there, add/edit/delete still works.

- [ ] **Step 4: Commit**

```bash
cd ict-meetup-admin
git add src/pages/settings/PaymentSetup.tsx
git commit -m "refactor: Payment Setup is now a single global form, no version picker"
```

---

## Task 14: Public frontend — API route and shared hook

**Files:**
- Modify: `ict-frontend/src/lib/api-routes.ts`
- Create: `ict-frontend/src/client/hooks/use-site-settings.ts`

**Interfaces:**
- Produces: `API_ROUTES.siteSettings`, `useSiteSettings()` returning `{ data, isLoading }` where `data` is `SiteSettings | undefined` — consumed by Tasks 15-19.

- [ ] **Step 1: Add the route**

In `ict-frontend/src/lib/api-routes.ts`, find:

```ts
  // ─── Settings ─────────────────────────────────────────────────────────────
  settings: "/settings",
  settingDetail: "/settings/${settingId}",
  settingsContacts: "/settings/contacts",
  settingsSocialMedia: "/settings/social-media",
  settingsPayments: "/settings/payments",
} as const;
```

Change to:

```ts
  // ─── Settings ─────────────────────────────────────────────────────────────
  settings: "/settings",
  settingDetail: "/settings/${settingId}",
  settingsContacts: "/settings/contacts",

  // ─── Site Settings ────────────────────────────────────────────────────────
  // Global, non-versioned record (club contact, social links, payment QR code).
  siteSettings: "/site-settings",
} as const;
```

- [ ] **Step 2: Create the shared hook**

Create `ict-frontend/src/client/hooks/use-site-settings.ts`:

```ts
import { useApiQuery } from "../../lib";

export interface SiteSettingsData {
  clubEmail: string | null;
  clubPhoneNumber: string | null;
  socialMediaLinks: { platform: string; link: string }[] | null;
  qrCodeUrl: string | null;
}

interface Envelope<T> {
  status: string;
  message: string;
  data: T;
}

/**
 * Global, non-versioned club settings (club email/phone, social links,
 * payment QR code) — same for every version, so this fetches unconditionally
 * with no versionId dependency, unlike the per-version settings queries.
 */
export function useSiteSettings() {
  const { data, isLoading } = useApiQuery("siteSettings")<
    Envelope<SiteSettingsData | null>
  >();

  return { data: data?.data ?? null, isLoading };
}
```

- [ ] **Step 3: Verify — type-check**

Run: `cd ict-frontend && npx tsc --noEmit -p tsconfig.app.json`
Expected: errors in `Footer.tsx`, `Payment.tsx` (they reference `settingsSocialMedia`/`settingsPayments`, which no longer exist in `API_ROUTES`). `ContactUs.tsx`, `Sponsors.tsx`, `PaymentSuccess.tsx` should NOT error yet — they only used `settingsContacts` (still present) and read `clubEmail`/`clubPhoneNumber` off its response type, which is a local interface in each file, not derived from `API_ROUTES`, so TypeScript won't catch that mismatch here — Tasks 16-18 fix the actual data source.

- [ ] **Step 4: Commit**

```bash
cd ict-frontend
git add src/lib/api-routes.ts src/client/hooks/use-site-settings.ts
git commit -m "feat: add site-settings API route and useSiteSettings hook"
```

---

## Task 15: Public frontend — Footer

**Files:**
- Modify: `ict-frontend/src/client/layouts/footer/Footer.tsx:1-49`

**Interfaces:**
- Consumes: `useSiteSettings()` (Task 14).

- [ ] **Step 1: Replace the two versioned queries with one global one**

In `ict-frontend/src/client/layouts/footer/Footer.tsx`, find:

```tsx
"use client";

import { useNavigate, NavLink } from "react-router-dom";
import Logo2 from "../headers/Logo/Logo2";
import PrimeITClub from "../../../assets/PrimeITClub.svg";
import PrimeCollege from "../../../assets/PrimeCollege.svg";
import SectionContainer from "../../components/sectionContainer";
import { useVersion } from "../../routes/VersionContext";
import { useApiQuery } from "../../../lib";
import { useVersionData } from "../../hooks/use-version-data";

interface Envelope<T> {
  status: string;
  message: string;
  data: T;
}

interface ContactSettings {
  clubEmail: string | null;
  clubPhoneNumber: string | null;
}

interface SocialMediaSettings {
  socialMediaLinks: { platform: string; link: string }[] | null;
}

export const Footer = () => {
  const navigate = useNavigate();
  const { getPath } = useVersion();
  const { versionId } = useVersionData();

  const { data: contactsRes } = useApiQuery("settingsContacts")<
    Envelope<ContactSettings>
  >({
    queryParams: { versionId: versionId ?? undefined },
    enabled: !!versionId,
  });

  const { data: socialRes } = useApiQuery("settingsSocialMedia")<
    Envelope<SocialMediaSettings>
  >({
    queryParams: { versionId: versionId ?? undefined },
    enabled: !!versionId,
  });

  const clubEmail = contactsRes?.data?.clubEmail || "itclub.prime@prime.edu.np";
  const clubPhone = contactsRes?.data?.clubPhoneNumber || "+123 45 6 789";

  const socialLinks = socialRes?.data?.socialMediaLinks ?? [];
```

Change to:

```tsx
"use client";

import { useNavigate, NavLink } from "react-router-dom";
import Logo2 from "../headers/Logo/Logo2";
import PrimeITClub from "../../../assets/PrimeITClub.svg";
import PrimeCollege from "../../../assets/PrimeCollege.svg";
import SectionContainer from "../../components/sectionContainer";
import { useVersion } from "../../routes/VersionContext";
import { useSiteSettings } from "../../hooks/use-site-settings";

export const Footer = () => {
  const navigate = useNavigate();
  const { getPath } = useVersion();

  const { data: siteSettings } = useSiteSettings();

  const clubEmail = siteSettings?.clubEmail || "itclub.prime@prime.edu.np";
  const clubPhone = siteSettings?.clubPhoneNumber || "+123 45 6 789";

  const socialLinks = siteSettings?.socialMediaLinks ?? [];
```

Everything below this point (the `facebookLink`/`instagramLink`/`linkedinLink` derivations and the JSX) is unchanged — it only reads `socialLinks`, `clubEmail`, `clubPhone`, which keep the same names.

`useVersionData` is no longer used in this file (there's no versioned query left) — its import is removed above; if any other value from that hook was used elsewhere in the file, keep the import and only remove the unused destructured fields. (In this file, `versionId` was the only thing pulled from it, so the whole import goes.)

- [ ] **Step 2: Verify — type-check**

Run: `cd ict-frontend && npx tsc --noEmit -p tsconfig.app.json`
Expected: no more errors in `Footer.tsx`.

- [ ] **Step 3: Verify — manual browser check**

Run: `cd ict-frontend && yarn dev`, open the site, scroll to the footer.
Expected: footer shows the club email/phone and social icons saved via the admin dashboard in Task 11/12 — and loads immediately without waiting on version resolution (no flash of the fallback `itclub.prime@prime.edu.np` before the real value appears, since the query no longer waits on `versionId`).

- [ ] **Step 4: Commit**

```bash
cd ict-frontend
git add src/client/layouts/footer/Footer.tsx
git commit -m "refactor: Footer reads club email/phone/social links from global site-settings"
```

---

## Task 16: Public frontend — Contact Us

**Files:**
- Modify: `ict-frontend/src/client/pages/contact-us/ContactUs.tsx`

**Interfaces:**
- Consumes: `useSiteSettings()` (Task 14), existing `settingsContacts` query (unchanged).

- [ ] **Step 1: Merge in the global clubEmail/clubPhoneNumber**

In `ict-frontend/src/client/pages/contact-us/ContactUs.tsx`, find:

```tsx
import { Mail, Phone } from "lucide-react";
import DepartmentCard from "./components/DepartmentCard";
import { useApiQuery } from "../../../lib";
import { useVersionData } from "../../hooks/use-version-data";

interface ContactDepartment {
  department: string;
  contacts: { name: string; phone: string }[];
}

interface ContactSettings {
  email: string | null;
  phoneNumber: string | null;
  teamName: string | null;
  clubEmail: string | null;
  clubPhoneNumber: string | null;
  contactDepartments: ContactDepartment[] | null;
}

const ContactUs = () => {
  const { versionId } = useVersionData();
  const { data: contactsRes, isLoading } = useApiQuery("settingsContacts")<{
    message: string;
    data: ContactSettings;
  }>({
    queryParams: { versionId: versionId ?? undefined },
    enabled: !!versionId,
  });

  const contactData = contactsRes?.data;

  if (isLoading) {
```

Change to:

```tsx
import { Mail, Phone } from "lucide-react";
import DepartmentCard from "./components/DepartmentCard";
import { useApiQuery } from "../../../lib";
import { useVersionData } from "../../hooks/use-version-data";
import { useSiteSettings } from "../../hooks/use-site-settings";

interface ContactDepartment {
  department: string;
  contacts: { name: string; phone: string }[];
}

interface ContactSettings {
  email: string | null;
  phoneNumber: string | null;
  contactDepartments: ContactDepartment[] | null;
}

const ContactUs = () => {
  const { versionId } = useVersionData();
  const { data: contactsRes, isLoading } = useApiQuery("settingsContacts")<{
    message: string;
    data: ContactSettings;
  }>({
    queryParams: { versionId: versionId ?? undefined },
    enabled: !!versionId,
  });
  const { data: siteSettings } = useSiteSettings();

  const contactData = contactsRes?.data;

  if (isLoading) {
```

Then find the two places `contactData?.clubEmail`/`contactData?.clubPhoneNumber` are used:

```tsx
            {contactData?.clubEmail && (
              <a
                href={`mailto:${contactData.clubEmail}`}
                className="flex items-center justify-center sm:justify-start gap-2 text-white/90 text-sm sm:text-base hover:text-white transition-colors"
              >
                <Mail size={16} className="shrink-0" />
                {contactData.clubEmail}
              </a>
            )}
            {contactData?.clubPhoneNumber && (
              <a
                href={`tel:${contactData.clubPhoneNumber}`}
                className="flex items-center justify-center sm:justify-start gap-2 text-white/90 text-sm sm:text-base hover:text-white transition-colors"
              >
                <Phone size={16} className="shrink-0" />
                {contactData.clubPhoneNumber}
              </a>
            )}
```

Change to:

```tsx
            {siteSettings?.clubEmail && (
              <a
                href={`mailto:${siteSettings.clubEmail}`}
                className="flex items-center justify-center sm:justify-start gap-2 text-white/90 text-sm sm:text-base hover:text-white transition-colors"
              >
                <Mail size={16} className="shrink-0" />
                {siteSettings.clubEmail}
              </a>
            )}
            {siteSettings?.clubPhoneNumber && (
              <a
                href={`tel:${siteSettings.clubPhoneNumber}`}
                className="flex items-center justify-center sm:justify-start gap-2 text-white/90 text-sm sm:text-base hover:text-white transition-colors"
              >
                <Phone size={16} className="shrink-0" />
                {siteSettings.clubPhoneNumber}
              </a>
            )}
```

The department cards below (`contactData?.contactDepartments`) are unchanged — that still comes from the versioned `settingsContacts` query.

- [ ] **Step 2: Verify — type-check**

Run: `cd ict-frontend && npx tsc --noEmit -p tsconfig.app.json`
Expected: no errors in `ContactUs.tsx`.

- [ ] **Step 3: Verify — manual browser check**

Navigate to the Contact Us page.
Expected: the "Any Queries?" block on the left shows the club email/phone from Task 11's saved values; department cards on the right still show whatever was saved in Contact Management (unaffected).

- [ ] **Step 4: Commit**

```bash
cd ict-frontend
git add src/client/pages/contact-us/ContactUs.tsx
git commit -m "refactor: ContactUs reads club email/phone from global site-settings"
```

---

## Task 17: Public frontend — Sponsors

**Files:**
- Modify: `ict-frontend/src/client/pages/sponsors/Sponsors.tsx:1-106`

**Interfaces:**
- Consumes: `useSiteSettings()` (Task 14), existing `settingsContacts` query (unchanged).

- [ ] **Step 1: Merge in the global clubEmail/clubPhoneNumber fallback**

In `ict-frontend/src/client/pages/sponsors/Sponsors.tsx`, find:

```tsx
import SectionContainer from "../../components/sectionContainer.tsx";
import SponsorData from "./SponsorData.tsx";
import GlowCircle from "./GlowCircle.tsx";
import { useApiQuery } from "../../../lib/index.ts";
import { useVersionData } from "../../hooks/use-version-data.ts";
import { Mail, Phone, ArrowRight } from "lucide-react";
import { Heading } from "../../../shared/design-components";
import { Link } from "react-router-dom";
import { useVersion } from "../../routes/VersionContext";
```

Change to:

```tsx
import SectionContainer from "../../components/sectionContainer.tsx";
import SponsorData from "./SponsorData.tsx";
import GlowCircle from "./GlowCircle.tsx";
import { useApiQuery } from "../../../lib/index.ts";
import { useVersionData } from "../../hooks/use-version-data.ts";
import { useSiteSettings } from "../../hooks/use-site-settings.ts";
import { Mail, Phone, ArrowRight } from "lucide-react";
import { Heading } from "../../../shared/design-components";
import { Link } from "react-router-dom";
import { useVersion } from "../../routes/VersionContext";
```

Then find:

```tsx
interface ContactDepartment {
  department: string;
  contacts: { name: string; phone: string }[];
}

interface ContactSettings {
  email: string | null;
  phoneNumber: string | null;
  teamName: string | null;
  clubEmail: string | null;
  clubPhoneNumber: string | null;
  contactDepartments: ContactDepartment[] | null;
}
```

Change to:

```tsx
interface ContactDepartment {
  department: string;
  contacts: { name: string; phone: string }[];
}

interface ContactSettings {
  email: string | null;
  phoneNumber: string | null;
  contactDepartments: ContactDepartment[] | null;
}
```

Then find:

```tsx
  const { data: contactsRes, isLoading: contactsLoading } = useApiQuery(
    "settingsContacts",
  )<Envelope<ContactSettings>>({
    queryParams: { versionId: versionId ?? undefined },
    enabled: !!versionId,
  });

  const categories = (categoriesRes?.data?.items ?? []).slice().sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const sponsors = sponsorsRes?.data?.items ?? [];
  const isLoading = versionLoading || categoriesLoading || sponsorsLoading || contactsLoading;
```

Change to:

```tsx
  const { data: contactsRes, isLoading: contactsLoading } = useApiQuery(
    "settingsContacts",
  )<Envelope<ContactSettings>>({
    queryParams: { versionId: versionId ?? undefined },
    enabled: !!versionId,
  });
  const { data: siteSettings } = useSiteSettings();

  const categories = (categoriesRes?.data?.items ?? []).slice().sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const sponsors = sponsorsRes?.data?.items ?? [];
  const isLoading = versionLoading || categoriesLoading || sponsorsLoading || contactsLoading;
```

Then find:

```tsx
    const email = contactData?.email ?? contactData?.clubEmail ?? null;
    const phone = contactData?.phoneNumber ?? contactData?.clubPhoneNumber ?? null;
```

Change to:

```tsx
    const email = contactData?.email ?? siteSettings?.clubEmail ?? null;
    const phone = contactData?.phoneNumber ?? siteSettings?.clubPhoneNumber ?? null;
```

Everything else (department filtering, the "Become a Sponsor" card JSX using `email`/`phone`/`deptsToDisplay`) is unchanged.

- [ ] **Step 2: Verify — type-check**

Run: `cd ict-frontend && npx tsc --noEmit -p tsconfig.app.json`
Expected: no errors in `Sponsors.tsx`.

- [ ] **Step 3: Verify — manual browser check**

Navigate to the Sponsors page, scroll to the "Become a Sponsor" card.
Expected: shows an email/phone (falling back to global club email/phone if Contact Management's version-specific email/phone are empty for the current version).

- [ ] **Step 4: Commit**

```bash
cd ict-frontend
git add src/client/pages/sponsors/Sponsors.tsx
git commit -m "refactor: Sponsors falls back to global club email/phone from site-settings"
```

---

## Task 18: Public frontend — Payment Success

**Files:**
- Modify: `ict-frontend/src/client/pages/register/PaymentSuccess.tsx:1-90`

**Interfaces:**
- Consumes: `useSiteSettings()` (Task 14), existing `settingsContacts` query (unchanged).

- [ ] **Step 1: Merge in the global clubEmail fallback**

In `ict-frontend/src/client/pages/register/PaymentSuccess.tsx`, find:

```tsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVersion } from "../../routes/VersionContext";
import { Button } from "../../../shared/design-components";
import { ChevronRight } from "lucide-react";
import TopBgContent from "../../components/bg-content";
import { Heading } from "../../../shared/design-components";
import Success from "../register/icons/Success.svg";
import { useApiQuery } from "../../../lib";
```

Change to:

```tsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVersion } from "../../routes/VersionContext";
import { Button } from "../../../shared/design-components";
import { ChevronRight } from "lucide-react";
import TopBgContent from "../../components/bg-content";
import { Heading } from "../../../shared/design-components";
import Success from "../register/icons/Success.svg";
import { useApiQuery } from "../../../lib";
import { useSiteSettings } from "../../hooks/use-site-settings";
```

Then find:

```tsx
interface ContactsData {
  email?: string | null;
  clubEmail?: string | null;
}
```

Change to:

```tsx
interface ContactsData {
  email?: string | null;
}
```

Then find:

```tsx
  const { data: contactsRes } = useApiQuery(
    "settingsContacts",
  )<Envelope<ContactsData>>({
    queryParams: { versionId: regDetail?.versionId },
    enabled: !!regDetail?.versionId,
  });
  const contactEmail = contactsRes?.data?.clubEmail || contactsRes?.data?.email || "—";
```

Change to:

```tsx
  const { data: contactsRes } = useApiQuery(
    "settingsContacts",
  )<Envelope<ContactsData>>({
    queryParams: { versionId: regDetail?.versionId },
    enabled: !!regDetail?.versionId,
  });
  const { data: siteSettings } = useSiteSettings();
  const contactEmail = siteSettings?.clubEmail || contactsRes?.data?.email || "—";
```

- [ ] **Step 2: Verify — type-check**

Run: `cd ict-frontend && npx tsc --noEmit -p tsconfig.app.json`
Expected: no errors in `PaymentSuccess.tsx`.

- [ ] **Step 3: Verify — manual browser check**

Complete a test registration through the register flow and land on the Payment Success page.
Expected: wherever `contactEmail` is displayed shows the global club email (or the versioned fallback if the global one is empty).

- [ ] **Step 4: Commit**

```bash
cd ict-frontend
git add src/client/pages/register/PaymentSuccess.tsx
git commit -m "refactor: PaymentSuccess reads club email from global site-settings"
```

---

## Task 19: Public frontend — Register flow's Payment step (QR code)

**Files:**
- Modify: `ict-frontend/src/client/pages/register/components/Payment.tsx`

**Interfaces:**
- Consumes: `useSiteSettings()` (Task 14).

- [ ] **Step 1: Replace the versioned QR query with the global one**

In `ict-frontend/src/client/pages/register/components/Payment.tsx`, find:

```tsx
import { useRef, useState } from "react";
import Upload from "../icons/Upload";
import { useApiQuery } from "../../../../lib";
import { useVersionData } from "../../../hooks/use-version-data";

interface PaymentProps {
  onFileChange?: (file: File | null) => void;
  selectedEvent?: {
    feeType: string;
    fee: string;
  } | null;
}

interface PaymentSettings {
  qrCodeUrl: string | null;
}

export default function Payment({ onFileChange, selectedEvent }: PaymentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { versionId } = useVersionData();

  const { data: paymentsRes } = useApiQuery("settingsPayments")<{
    message: string;
    data: PaymentSettings;
  }>({
    queryParams: { versionId: versionId ?? undefined },
    enabled: !!versionId,
  });

  const qrCodeUrl = paymentsRes?.data?.qrCodeUrl ?? null;
```

Change to:

```tsx
import { useRef, useState } from "react";
import Upload from "../icons/Upload";
import { useSiteSettings } from "../../../hooks/use-site-settings";

interface PaymentProps {
  onFileChange?: (file: File | null) => void;
  selectedEvent?: {
    feeType: string;
    fee: string;
  } | null;
}

export default function Payment({ onFileChange, selectedEvent }: PaymentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { data: siteSettings } = useSiteSettings();

  const qrCodeUrl = siteSettings?.qrCodeUrl ?? null;
```

Everything below (the upload box, QR display JSX) is unchanged — it only reads `qrCodeUrl`.

- [ ] **Step 2: Verify — type-check**

Run: `cd ict-frontend && npx tsc --noEmit -p tsconfig.app.json`
Expected: **zero errors across the whole project** — this was the last file referencing the removed `settingsPayments`/`settingsSocialMedia` routes.

- [ ] **Step 3: Verify — manual browser check**

Go through the register flow to a paid event's Payment step.
Expected: the QR code image saved in Task 13 appears next to the upload box.

- [ ] **Step 4: Commit**

```bash
cd ict-frontend
git add src/client/pages/register/components/Payment.tsx
git commit -m "refactor: register Payment step reads QR code from global site-settings"
```

---

## Task 20: Final end-to-end verification

**Files:** none (verification only).

- [ ] **Step 1: Restore the real data**

If Task 4/11/12/13's verification used placeholder values (`itclub.prime@prime.edu.np`, a test social link, a test QR image), replace them now with whatever real club email/phone/social links/QR code you noted down per the Global Constraints before Task 5 dropped the old columns.

- [ ] **Step 2: Full three-app smoke test**

Run all three dev servers simultaneously (`ict-meetup-api`: `pnpm dev`, `ict-meetup-admin`: `yarn dev`, `ict-frontend`: `yarn dev`), then:

1. Admin: visit each of the four Settings tabs. Club Details, Social Media, Payment Setup each show a single form with the real values. Contact Management still shows its version dropdown and table, unaffected — pick a version, confirm its email/phone/departments still load and save correctly.
2. Public site: visit Home (footer), Contact Us, Sponsors, and go through a full registration (both a free and a paid event, if both exist) to Payment Success. Confirm club email/phone/social links/QR code all show the real values everywhere they appear.
3. Backend: `curl -s http://localhost:4000/api-docs.json | grep -o '"SiteSettings"'` — expect at least one match, confirming the new tag registered in the swagger spec.

- [ ] **Step 2: Confirm no dangling references**

Run: `cd ict-meetup-api && grep -rn "clubEmail\|clubPhoneNumber\|socialMediaLinks\|qrCodeUrl\|qrCodePath\|qrCodeLocalPath" src/modules/settings src/modules/event-registration --include="*.ts"`
Expected: no output (all removed from the old `settings` module and `event-registration` service — anything matching now should only live under `src/modules/site-settings/`).

Run: `cd ict-meetup-admin && grep -rln "settingQrCode\|SettingsVersionBar" src/pages/settings`
Expected: only `ContactManagement.tsx` (and `SettingsVersionBar.tsx` itself) — confirms `ClubDetails.tsx`/`SocialMediaProfile.tsx`/`PaymentSetup.tsx` no longer reference the version bar or the old QR route.

Run: `cd ict-frontend && grep -rln "settingsSocialMedia\|settingsPayments" src`
Expected: no output.

- [ ] **Step 3: Final commit (if any cleanup was needed)**

If Steps 1-2 required any fixes, commit them per-repo with a message describing what was found. Otherwise, this task requires no commit — it's verification-only.
