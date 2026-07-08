# Non-versioned Site Settings

## Context

The admin Settings section has four tabs — Club Details, Social Media, Payment
Setup, and Contact Management — all backed by a single versioned `Settings`
entity (`ict-meetup-api/src/modules/settings`), one row per
`FlagshipEventVersion`. In practice, club email/phone, social links, and the
payment QR code represent the club's real-world identity and don't change
per event edition — only Contact Management's general email/phone and
per-department contacts genuinely vary year to year (organizing committee
changes). Keeping the first three versioned means admins re-enter the same
data for every new version, and the public site's data model implies a
distinction that doesn't reflect reality.

This spec covers moving Club Details, Social Media, and Payment Setup to a
single global (non-versioned) record, while Contact Management stays
per-version exactly as it is today.

## Goals

- Club email/phone, social media links, and payment QR code become a single
  global record, editable once, shown identically across all versions
  (including archived ones).
- Contact Management (general email/phone, department contacts) remains
  per-version, unchanged.
- Registration confirmation emails pull club email/phone/social links from
  the new global source.
- Admin UX for the three affected tabs simplifies from "table of
  versions + add/edit form" to a single always-visible form.

## Non-goals

- No data migration/backfill — the new singleton starts empty; admins
  re-enter values once after deploy.
- No change to Contact Management's versioning, UX, or API.
- No change to how `FlagshipEventVersion`/versioning works for any other
  module (events, hero sections, gallery, etc.).

## Data model

New table `site_settings`, entity `SiteSettings` (extends the shared
`BaseEntity`: `id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`).
At most one row will ever exist.

```
SiteSettings
  clubEmail          varchar(255) nullable
  clubPhoneNumber    varchar(20)  nullable
  socialMediaLinks   json nullable   // { platform: string; link: string }[]
  qrCodeUrl          text nullable   // Cloudinary URL
  qrCodePath         text nullable   // Cloudinary public_id, for deletion
  qrCodeLocalPath    text nullable   // temp local file path, for cleanup
```

The existing `Settings` entity shrinks to only what Contact Management
needs:

```
Settings (unchanged except removals below)
  versionId (FK, required, unique per version) — unchanged
  email, phoneNumber, contactDepartments — kept
  clubEmail, clubPhoneNumber, socialMediaLinks,
  qrCodeUrl, qrCodePath, qrCodeLocalPath, teamName — REMOVED
```

`teamName` is removed as part of this change too — it's already dead in the
UI (commented out in `ContactManagement.tsx`) and unrelated to any tab, so
there's no reason to keep carrying it once we're altering this table.

No migration script backfills data from any existing version's `Settings`
row into `SiteSettings` — it's created empty and populated manually via the
admin UI after deploy.

**Risk — data loss on deploy:** dropping these columns permanently destroys
whatever `clubEmail`/`clubPhoneNumber`/`socialMediaLinks`/`qrCodeUrl` is
currently saved on any version's `Settings` row. In particular, any
existing QR code image is orphaned in Cloudinary — its `qrCodePath`
(the deletion pointer) is dropped along with the column, so nothing will
ever clean that asset up automatically. Before deploying, note down the
current club email/phone, social links, and re-download the current QR
code image if one exists, so they can be manually re-entered via the new
singleton form.

**Deployment note:** locally, `NODE_ENV=local` sets `synchronize: true`, so
these entity changes apply automatically on server restart — no manual
migration needed to test this locally. For `dev`/`prod`, `synchronize` is
off and a real migration is required: run
`pnpm typeorm:generate-migration --name=NonVersionedSiteSettings` after the
entity changes are in place, review the generated SQL (it should contain a
`CREATE TABLE site_settings` and an `ALTER TABLE settings DROP COLUMN ...`
for each removed field), and run it before/during deploy.

## Backend API

New module `site-settings` (mirrors the existing `settings` module's
structure: `entities/`, `validators/`, `services/`, `controllers/`,
`routes/`):

- `GET /api/site-settings` — public, no auth. Returns the singleton row, or
  `null` if it hasn't been created yet.
- `PUT /api/site-settings` — auth required. Upserts the singleton
  (create-if-missing, else update in place). Multipart, handling the QR
  code file upload the same way `PaymentSetup`/`settings.controller.ts`
  does today (`imageUploadHandler` + Cloudinary), deleting the old
  Cloudinary asset when a new QR image replaces it.
- `DELETE /api/site-settings/qrcode` — auth required. Mirrors
  `removeQrCode` on the old settings controller.

Register `SiteSettings` in `db.config.ts`'s entity list and mount
`createSiteSettingsRouter` in `index.ts` alongside the existing settings
router.

`AuditLogScope` gains a `SITE_SETTINGS` member for the audit log calls on
`PUT`/QR-delete. `swagger.utils.ts`'s static `tags` array gains a
`SiteSettings` entry alongside the existing `Setting` tag, so the new
routes' `@swagger` JSDoc groups correctly in `/api-docs`.

### Changes to the existing `settings` module

- `SettingsController.getSocialMedia` and `getPayments` are deleted
  (superseded by `GET /api/site-settings`); their routes are removed from
  `settings.routes.ts`.
- `SettingsController.getContacts` shrinks to return only `email`,
  `phoneNumber`, `contactDepartments`.
- `createSettingsSchema`/`updateSettingsSchema` (`settings.validator.ts`)
  drop `clubEmail`, `clubPhoneNumber`, `socialMediaLinks`, `qrCodeUrl`,
  `qrCodePath`, `qrCodeLocalPath`, `teamName`.
- `SettingsService` drops QR-code-related methods/logic (`removeQrCode`,
  the QR lifecycle handling in `update`) since QR code no longer lives on
  this entity.

### Registration email integration

`mail.service.ts` itself needs **no changes** — its `ClubInfo` interface is
already decoupled from the `Settings` entity; it just renders whatever
object it's handed. Only the assembly of that object changes:
`EventRegistrationService.getClubInfo` (`event-registration.service.ts:27-41`)
currently reads `settings.clubEmail ?? settings.email` etc. from the
per-version `Settings` row. It changes to read directly from the new
`SiteSettings` singleton, with no per-version fallback (club identity now
has exactly one source of truth):

```ts
private async getClubInfo(versionId: string, version: FlagshipEventVersion): Promise<ClubInfo> {
  const [siteSettings, hero] = await Promise.all([
    this.siteSettingsRepository.findOne({ where: {} }),
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

## Admin frontend (`ict-meetup-admin`)

`ClubDetails.tsx`, `SocialMediaProfile.tsx`, and `PaymentSetup.tsx` currently
share the "table of all versions + Add/Edit toggles into a form" UX (via
`useSettingsForVersion`/`useSaveSettings`), needed because previously many
rows could exist (one per version). With a singleton, that shell is
unnecessary — each becomes a single always-visible form: load the one
record on mount, edit in place, one Save button. No version picker, no
`SettingsVersionBar`, no per-row table, no delete-if-draft gating (there's
no version status to gate on anymore).

A new shared hook `useSiteSettings()` (in
`ict-meetup-admin/src/pages/settings/`, replacing
`useSettingsForVersion`/`useSaveSettings` for these three pages only) wraps
`GET /api/site-settings` on mount and `PUT /api/site-settings` to save —
no `versionId` anywhere in the flow.

`ContactManagement.tsx` is untouched — keeps its version picker,
table-of-versions, and per-version create/update/delete exactly as today,
still built on `useSettingsForVersion`/`useSaveSettings` against
`/api/settings`.

`types/settings.ts` splits into two types: `Settings` (now just
`versionId`, `email`, `phoneNumber`, `contactDepartments`,
`flagshipEventVersion`, and it keeps the `ContactPerson`/
`ContactDepartment` types since those belong to Contact Management) and a
new `SiteSettings` (`clubEmail`, `clubPhoneNumber`, `socialMediaLinks`,
`qrCodeUrl`, taking over the existing `SocialMediaLink`/`SOCIAL_PLATFORMS`
exports since those belong to the Social Media tab). New `API_ROUTES`
entries: `siteSettings` (`/site-settings`) and `siteSettingsQrCode`
(`/site-settings/qrcode`) — note the QR delete route needs no `${id}`
placeholder (unlike the old `settingQrCode: "/settings/${id}/qrcode"`)
since there's only ever one row.

`SettingsVersionBar.tsx` is not deleted — it's still used by
`ContactManagement.tsx`. Only `PaymentSetup.tsx` stops importing it.

## Public frontend (`ict-frontend`)

Five consumers currently read club-identity fields off the versioned
settings endpoints and need to switch to the new global endpoint:

| File | Currently uses (versioned) | Change |
|---|---|---|
| `Footer.tsx` | `settingsContacts` + `settingsSocialMedia` for clubEmail/clubPhoneNumber/socialMediaLinks | Replace both with one new `siteSettings` call |
| `ContactUs.tsx` | `settingsContacts` for everything | Keep versioned call for email/phoneNumber/contactDepartments; add `siteSettings` for clubEmail/clubPhoneNumber |
| `Sponsors.tsx` | `settingsContacts` for everything | Same merge as ContactUs |
| `PaymentSuccess.tsx` | `settingsContacts` (clubEmail fallback) | Add `siteSettings` for clubEmail |
| `Payment.tsx` (register flow) | `settingsPayments` for qrCodeUrl | Replace with `siteSettings` |

New `API_ROUTES.siteSettings` (`/site-settings`, public GET) plus a small
shared hook (e.g. `useSiteSettings()`) wrapping
`useApiQuery("siteSettings")` so these five files don't each duplicate the
fetch.

All five currently gate their versioned settings queries on
`enabled: !!versionId` (`Footer.tsx`, `ContactUs.tsx`, `Sponsors.tsx`,
`PaymentSuccess.tsx`, `Payment.tsx`) because the old endpoints required a
`versionId` query param. The new `siteSettings` query has no version
dependency, so it should be enabled unconditionally (fetch on mount) —
don't copy the old `enabled` guard onto it, or club info will wait on
version resolution for no reason.

## Consequence: historical versions

Archived versions (v5, v6, v7) will show the same global club email/phone,
social links, and QR code as the current version going forward — they no
longer retain whatever was actually saved for them historically. This is
accepted as correct: these fields represent the club's identity, not
something that should have varied per edition in the first place.

## Verification plan

0. Before touching any code: record the current club email/phone, social
   links, and download the current QR code image (if any exist on any
   version today), so they can be manually re-entered after the columns
   are dropped.
1. Backend: start `pnpm dev`, confirm `GET`/`PUT /api/site-settings` and
   `DELETE /api/site-settings/qrcode` work; confirm
   `GET /api/settings/contacts` no longer returns `clubEmail`/
   `clubPhoneNumber`; confirm `/api/settings/social-media` and
   `/api/settings/payments` routes are gone.
2. Admin: Club Details, Social Media, and Payment Setup each load/save as a
   single form with no version picker; Contact Management still shows the
   version table, unaffected.
3. Public: Footer, Contact Us, Sponsors, the registration flow's Payment
   step, and the Payment Success page all render the right data.
4. Mail: submit a test registration and confirm the confirmation email's
   club contact block still populates correctly from the new global
   source.
5. Re-enter the club email/phone, social links, and re-upload the QR code
   (from step 0) into the new Club Details/Social Media/Payment Setup
   forms, and confirm they appear correctly across the public site.
