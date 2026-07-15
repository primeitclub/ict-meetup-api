import "reflect-metadata";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import path from "path";
import connectDatabase from "./shared/config/typeorm/db.config";
import { envConfig } from "./shared/config/env";
import createSeedRouter from "./modules/seed/seed.routes";
import createVersionRouter from "./modules/flagship-event/routes/flagship-event.routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./shared/utils/swagger.utils";
import { errorHandler } from "./shared/utils/helpers/error.helper";
import createAuthRouter from "./modules/auth/routes/auth.routes";
import cookieParser from "cookie-parser";
import createTeamMemberRouter from "./modules/team-members/routes/team-member.routes";
import createAssetLibraryRouter from "./modules/asset-library/routes/asset-library.routes";
import createUploadRouter from "./modules/upload/routes/upload.routes";
import { startCronJobs } from "./shared/cron/cron";
import { Request, Response } from "express";
import createAuditLogRouter from "./modules/auditlogs/routes/audit-log.routes";
import createHeroSectionRouter from "./modules/hero-sections/routes/hero-section.routes";
import createAboutSectionRouter from "./modules/about-sections/routes/about-section.routes";
import createFaqRouter from "./modules/faq/routes/faq.routes";
import createEventRouter from "./modules/event/routes/event.routes";
import createSpeakerRouter from "./modules/speaker/routes/speaker.routes";
import createSponsorRouter from "./modules/sponsor/routes/sponsor.routes";
import createEventRegistrationRouter from "./modules/event-registration/routes/event-registration.routes";
import createGalleryRouter from "./modules/gallery/routes/gallery.routes";
import createSettingsRouter from "./modules/settings/routes/settings.routes";
import createSiteSettingsRouter from "./modules/site-settings/routes/site-settings.routes";
import createContentRouter from "./modules/content/routes/content.routes";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

app.set("trust proxy", 1);
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to be loaded from other origins
}));

app.use(express.json({ limit: "50kb" }));

const allowedOrigins = envConfig.ALLOWED_ORIGINS.split(",").map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Serve local assets publicly — must be after CORS & helmet config
// Filenames are timestamp+uuid based and never reused, so cache aggressively.
app.use(
  "/public/assets",
  express.static(path.join(process.cwd(), "public", "assets"), {
    maxAge: envConfig.STATIC_ASSETS_MAX_AGE,
    immutable: true,
  }),
);

app.use(cookieParser());

if (envConfig.NODE_ENV !== "prod") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/api-docs.json", (req: Request, res: Response) => {
    res.json(swaggerSpec);
  });
}

app.use(errorHandler);

connectDatabase
  .initialize()
  .then(() => {
    console.log("Database connected successfully.");

    // Rate limiters — only applied in prod
    if (envConfig.NODE_ENV === 'prod') {
      const authLoginLimiter = rateLimit({ windowMs: 60_000, max: 5, standardHeaders: true, legacyHeaders: false });
      const authRefreshLimiter = rateLimit({ windowMs: 60_000, max: 10, standardHeaders: true, legacyHeaders: false });
      const registrationLimiter = rateLimit({ windowMs: 5 * 60_000, max: 3, standardHeaders: true, legacyHeaders: false });
      const publicReadLimiter = rateLimit({ windowMs: 60_000, max: 60, standardHeaders: true, legacyHeaders: false });

      app.use("/api/auth/login", authLoginLimiter);
      app.use("/api/auth/refresh-token", authRefreshLimiter);
      app.use("/api/event-registrations", registrationLimiter);
      app.use("/api/content", publicReadLimiter);
      app.use("/api/events", publicReadLimiter);
    }

    // Register routes AFTER DB is initialized — safe to create repositories
    app.use("/api/auth", createAuthRouter(connectDatabase));
    app.use(
      "/api/flagship-event/versions",
      createVersionRouter(connectDatabase),
    );
    app.use("/api/team-members", createTeamMemberRouter(connectDatabase));
    app.use("/api/asset-library", createAssetLibraryRouter(connectDatabase));
    app.use("/api/seeds", createSeedRouter(connectDatabase));
    app.use("/api/upload", createUploadRouter(connectDatabase));
    app.use("/api/audit-logs", createAuditLogRouter(connectDatabase));
    app.use("/api/hero-sections", createHeroSectionRouter(connectDatabase));
    app.use("/api/about-sections", createAboutSectionRouter(connectDatabase));
    app.use("/api/faqs", createFaqRouter(connectDatabase));
    app.use("/api/events", createEventRouter(connectDatabase));
    app.use("/api/speakers", createSpeakerRouter(connectDatabase));
    app.use("/api/sponsors", createSponsorRouter(connectDatabase));
    app.use(
      "/api/event-registrations",
      createEventRegistrationRouter(connectDatabase),
    );
    app.use("/api/gallery", createGalleryRouter(connectDatabase));
    app.use("/api/settings", createSettingsRouter(connectDatabase));
    app.use("/api/site-settings", createSiteSettingsRouter(connectDatabase));
    app.use("/api/content", createContentRouter(connectDatabase));

    app.use(errorHandler);

    // Start cron jobs after DB is ready
    startCronJobs(connectDatabase);

    const PORT = envConfig.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });
