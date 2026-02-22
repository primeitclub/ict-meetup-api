import { Router } from "express";
import { DataSource } from "typeorm";
import { AuthController } from "../controller/auth.controller";
import { validateRequestBody } from "../../../shared/validators/request.validator";
import { createAuthenticate } from "../../../shared/middlewares/auth.middleware";
import { loginSchema } from "../validators/auth.validator";

const createAuthRouter = (dataSource: DataSource) => {
      const authRouter = Router();
      const authController = new AuthController(dataSource);
      const authenticate = createAuthenticate(dataSource);

      /**
       * @swagger
       * /api/auth/login:
       *   post:
       *     summary: Login a user
       *     tags: [Auth]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             required: [email, password]
       *             properties:
       *               email: { type: string, format: email }
       *               password: {next-auth.csrf-token type: string }
       *     responses:
       *       200:
       *         description: Login successful
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message: { type: string }
       *       401:
       *         description: Unauthorized
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message: { type: string }
       *                 error: { type: string }
       *       500:
       *         description: Internal server error
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message: { type: string }
       *                 error: { type: string }
       */
      authRouter.post("/login", validateRequestBody(loginSchema), authController.login);


      /**
       * @swagger
       * /api/auth/logout:
       *   post:
       *     summary: Logout a user
       *     tags: [Auth]
       *     responses:
       *       200:
       *         description: Logout successful
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message: { type: string }
       *       401:
       *         description: Unauthorized
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message: { type: string }
       *                 error: { type: string }
       *       500:
       *         description: Internal server error
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message: { type: string }
       *                 error: { type: string }
       */
      authRouter.post("/logout", authenticate, authController.logout);

      /**
       * @swagger
       * /api/auth/refresh-token/{expiry}:
       *   post:
       *     summary: Refresh a token (Supports optional expiry in path, query, or body for testing)
       *     tags: [Auth]
       *     parameters:
       *       - in: path
       *         name: expiry
       *         schema:
       *           type: string
       *         required: false
       *         description: The custom expiry time for the new refresh token (e.g., '10s', '1m', '1h')
       *       - in: query
       *         name: expiry
       *         schema:
       *           type: string
       *         required: false
       *         description: The custom expiry time for the new refresh token
       *     responses:
       *       200:
       *         description: Refresh token successful
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message: { type: string }
       *       401:
       *         description: Unauthorized
       *       500:
       *         description: Internal server error
       */
      authRouter.post("/refresh-token", authController.refreshToken);
      authRouter.post("/refresh-token/:expiry", authController.refreshToken);

      return authRouter;
};

export default createAuthRouter;