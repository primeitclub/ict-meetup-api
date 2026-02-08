import swaggerJSDoc from "swagger-jsdoc";
import { envConfig } from "../config/env";

const options: swaggerJSDoc.Options = {
      definition: {
            openapi: "3.0.0",
            info: {
                  title: "ICT-MEETUP-API",
                  version: "1.0.0",
                  description: 'API Documentation for ICT Meetup App',
            },
      },
      tags: [
            {
                  name: "Seed",
                  description: "Seed endpoints",
            },
            {
                  name: "FlagshipEventVersions",
                  description: "API for managing flagship event versions",
            },
            {
                  name: "Teams",
                  description: "API for managing teams",
            },
            {
                  name: "Categories",
                  description: "API for managing categories",
            },
            {
                  name: "TeamMembers",
                  description: "API for managing team members",
            },
            {
                  name: "Asset Libraries",
                  description: "API for managing asset libraries",
            }

      ],
      apis: [process.cwd() + (envConfig.NODE_ENV === 'dev' ? "/modules/**/*.routes.js" : "/src/modules/**/*.routes.ts")],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;