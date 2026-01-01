import swaggerJSDoc from "swagger-jsdoc";

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
      ],
      apis: [process.cwd() + "/src/modules/**/*.routes.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;