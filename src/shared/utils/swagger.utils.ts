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
            tags: [
                  {
                        name: "Auth",
                        description: "API for managing authentication",
                  },
                  {
                        name: "FlagshipEventVersions",
                        description: "API for managing flagship event versions",
                  },
                  {
                        name: "TeamMembers",
                        description: "API for managing team members",
                  },
                  {
                        name: "TeamMemberCategories",
                        description: "API for managing team member categories",
                  },
                  {
                        name: "TeamMemberDesignations",
                        description: "API for managing team member designations",
                  },
                  {
                        name: "HeroSections",
                        description: "API for managing hero sections",
                  },
                  {
                        name: "AboutSections",
                        description: "API for managing about sections",
                  },
                  {
                        name: "FAQs",
                        description: "API for managing FAQs",
                  },
                  {
                        name: "Events",
                        description: "API for managing events",
                  },
                  {
                        name: "EventCategories",
                        description: "API for managing event categories",
                  },
                  {
                        name: "AuditLogs",
                        description: "API for managing audit logs",
                  },
                  {
                        name: "Seed",
                        description: "Seed endpoints",
                  },
            ],
      },
      apis: ["./src/modules/**/*.routes.ts", "./modules/**/*.routes.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
