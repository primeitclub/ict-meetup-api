import "reflect-metadata";
import dotenv from "dotenv";
import cors from "cors";
import express, { Request, Response } from "express";
import connectDatabase from "./shared/config/typeorm/db.config";
import { envConfig } from "./shared/config/env";
import seedRouter from "./modules/seed/seed.routes";
import versionRouter from "./modules/event/routes/flagship-event-version.routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./shared/utils/swagger.utils";
// ssdimport { logAudit } from './shared/utils/audit.utils';
import { AuditLogType, AuditLogActionType, AuditLogScope } from './shared/constants/audit-log.constants';
import { errorHandler } from "./shared/utils/helpers/error.helper";
dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    allowedHeaders: "*",
  })
);

app.use("/api/seeds", seedRouter);
app.use("/api/event/versions", versionRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);
connectDatabase.initialize()
  .then(() => {
    console.log('Database connected successfully.');
    const PORT = envConfig.port || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    }); ``
  })
  .catch((error) => {
    console.error('Error connecting to the database', error);
  });