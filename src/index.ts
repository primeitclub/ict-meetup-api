import "reflect-metadata";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import connectDatabase from "./shared/config/typeorm/db.config";
import { envConfig } from "./shared/config/env";
import createSeedRouter from "./modules/seed/seed.routes";
import createVersionRouter from "./modules/flagship-event/routes/flagship-event.routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./shared/utils/swagger.utils";
import { errorHandler } from "./shared/utils/helpers/error.helper";
import createAuthRouter from "./modules/auth/routes/auth.routes";
import cookieParser from "cookie-parser";
import createCategoryRouter from "./modules/category/routes/category.routes";
import createTeamMemberRouter from "./modules/team-members/routes/team-member.routes";
import createAssetLibraryRouter from "./modules/asset-library/routes/asset-library.routes";
import createUploadRouter from "./modules/upload/routes/upload.routes";
import { startCronJobs } from "./shared/cron/cron";
import { Request, Response } from "express";
import createAuditLogRouter from "./modules/auditlogs/routes/audit-log.routes";
import createHeroSectionRouter from "./modules/hero-sections/routes/hero-section.routes";
import createAboutSectionRouter from "./modules/about-sections/routes/about-section.routes";
import createFaqRouter from "./modules/faq/routes/faq.routes";
dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api-docs.json', (req: Request, res: Response) => {
  res.json(swaggerSpec);
});

app.use(errorHandler);

connectDatabase.initialize()
  .then(() => {
    console.log('Database connected successfully.');

    // Register routes AFTER DB is initialized — safe to create repositories
    app.use("/api/auth", createAuthRouter(connectDatabase));
    app.use("/api/flagship-event/versions", createVersionRouter(connectDatabase));
    app.use("/api/categories", createCategoryRouter(connectDatabase));
    app.use("/api/team-members", createTeamMemberRouter(connectDatabase));
    app.use("/api/asset-library", createAssetLibraryRouter(connectDatabase));
    app.use("/api/seeds", createSeedRouter(connectDatabase));
    app.use("/api/upload", createUploadRouter(connectDatabase));
    app.use("/api/audit-logs", createAuditLogRouter(connectDatabase));
    app.use("/api/hero-sections", createHeroSectionRouter(connectDatabase));
    app.use("/api/about-sections", createAboutSectionRouter(connectDatabase));
    app.use("/api/faqs", createFaqRouter(connectDatabase));

    app.use(errorHandler);

    // Start cron jobs after DB is ready
    startCronJobs(connectDatabase);

    const PORT = envConfig.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database', error);
  });
