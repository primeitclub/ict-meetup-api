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
      ],
      apis: [process.cwd() + "/src/modules/**/*.routes.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;