import { Router } from "express";
import { DataSource } from "typeorm";
import { ContentController } from "../controllers/content.controller";

const createContentRouter = (dataSource: DataSource) => {
  const contentRouter = Router();
  const controller = new ContentController(dataSource);

  /**
   * @swagger
   * /api/content:
   *   get:
   *     summary: Aggregated landing-page content for the current edition
   *     description: >
   *       Returns every landing-page section (hero, about, highlights, speakers,
   *       gallery, sponsors, and faq) for the current edition in one payload.
   *       `faq` is included only for the current edition.
   *     tags: [Content]
   *     responses:
   *       200:
   *         description: OK
   *       404:
   *         description: No current edition found
   */
  contentRouter.get("/", controller.getHomeContent);

  /**
   * @swagger
   * /api/content/{slug}:
   *   get:
   *     summary: Aggregated landing-page content for a specific edition
   *     description: >
   *       Same aggregated payload as `/api/content`, but for the edition
   *       identified by `slug`. `faq` is included only when that edition is
   *       the current one.
   *     tags: [Content]
   *     parameters:
   *       - in: path
   *         name: slug
   *         required: true
   *         schema: { type: string }
   *         description: Edition slug.
   *     responses:
   *       200:
   *         description: OK
   *       404:
   *         description: No edition found for the given slug
   */
  contentRouter.get("/:slug", controller.getHomeContent);

  return contentRouter;
};

export default createContentRouter;
