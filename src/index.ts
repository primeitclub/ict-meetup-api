import "reflect-metadata";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import connectDatabase from "./shared/config/typeorm/db.config";
import { envConfig } from "./shared/config/env";
import seedRouter from "./modules/seed/seed.routes";
import versionRouter from "./modules/flagship-event/routes/flagship-event.routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./shared/utils/swagger.utils";
import { errorHandler } from "./shared/utils/helpers/error.helper";
import authRouter from "./modules/auth/routes/auth.routes";
import cookieParser from "cookie-parser";
import categoryRouter from "./modules/category/routes/category.routes";
import teamMemberRouter from "./modules/team-members/routes/team-member.routes";
import assetLibraryRouter from "./modules/asset-library/routes/asset-library.routes";
import { startCronJobs } from "./shared/cron/cron";
import { Request, Response } from "express";
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

app.use("/api/auth", authRouter);
app.use("/api/seeds", seedRouter);
app.use("/api/flagship-event/versions", versionRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/team-members", teamMemberRouter);
app.use("/api/asset-library", assetLibraryRouter);


app.use(errorHandler);

connectDatabase.initialize()
  .then(() => {
    console.log('Database connected successfully.');
    const PORT = envConfig.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    }); ``
  })
  .catch((error) => {
    console.error('Error connecting to the database', error);
  });

// start cron jobs
startCronJobs();