import { Router } from 'express';
import { DataSource } from 'typeorm';
import { AssetLibraryRepository } from '../repositories/asset-library.repository';
import { AssetRepository } from '../repositories/asset.repository';
import { AssetLibraryService } from '../services/asset-library.service';
import { AssetService } from '../services/asset.service';
import { createAssetLibraryController } from '../controllers/asset-library.controller';
import { createAssetController } from '../controllers/asset.controller';
import { validateCreateAssetLibrary, validateUpdateAssetLibrary, validateAssetLibraryId } from '../validators/asset-library.validator';
import { validateCreateAsset, validateUpdateAsset, validateAssetId } from '../validators/asset.validator';
import { authenticate } from '../../../shared/middlewares/auth.middleware';
import connectDatabase from '../../../shared/config/typeorm/db.config';

const createAssetLibraryRouter = (dataSource: DataSource) => {
  const router = Router();


  
  const assetLibraryRepository = new AssetLibraryRepository(dataSource);
  const assetRepository = new AssetRepository(dataSource);
  const assetLibraryService = new AssetLibraryService(assetLibraryRepository);
  const assetService = new AssetService(assetRepository);

  const assetLibraryController = createAssetLibraryController(assetLibraryService);
  const assetController = createAssetController(assetService);

  // Asset Library routes

  /**
   * @swagger
   * /api/asset-libraries:
   *   post:
   *     summary: Create a new asset library
   *     tags: [Asset Libraries]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [flagship_event_version_id, source_table, source_table_id, max_image_upload]
   *             properties:
   *               flagship_event_version_id: { type: string, format: uuid }
   *               source_table: { type: string, enum: [hero_sections, gallery_items, achievement_metrics, speakers, team_members] }
   *               source_table_id: { type: string, format: uuid }
   *               max_image_upload: { type: integer, minimum: 1 }
   *               extra_options: { type: object }
   *     responses:
   *       201:
   *         description: Created
   */
  router.post('/', authenticate, validateCreateAssetLibrary, assetLibraryController.create);

  /**
   * @swagger
   * /api/asset-libraries:
   *   get:
   *     summary: Get all asset libraries
   *     tags: [Asset Libraries]
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/', authenticate, assetLibraryController.getAll);

  /**
   * @swagger
   * /api/asset-libraries/{id}:
   *   get:
   *     summary: Get asset library by ID
   *     tags: [Asset Libraries]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/:id', authenticate, validateAssetLibraryId, assetLibraryController.getById);

  /**
   * @swagger
   * /api/asset-libraries/{id}:
   *   put:
   *     summary: Update an asset library
   *     tags: [Asset Libraries]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               max_image_upload: { type: integer, minimum: 1 }
   *               extra_options: { type: object }
   *     responses:
   *       200:
   *         description: OK
   */
  router.put('/:id', authenticate, validateAssetLibraryId, validateUpdateAssetLibrary, assetLibraryController.update);

  /**
   * @swagger
   * /api/asset-libraries/{id}:
   *   delete:
   *     summary: Delete an asset library
   *     tags: [Asset Libraries]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: OK
   */
  router.delete('/:id', authenticate, validateAssetLibraryId, assetLibraryController.delete);

  // Nested Asset routes

  /**
   * @swagger
   * /api/asset-libraries/{id}/assets:
   *   post:
   *     summary: Create a new asset in library
   *     tags: [Assets]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *         description: Asset library ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [display_order]
   *             properties:
   *               image_path: { type: string }
   *               image_url: { type: string, format: uri }
   *               display_order: { type: integer, minimum: 0 }
   *     responses:
   *       201:
   *         description: Created
   */
  router.post('/:id/assets', authenticate, validateAssetLibraryId, validateCreateAsset, assetController.create);

  /**
   * @swagger
   * /api/asset-libraries/{id}/assets:
   *   get:
   *     summary: Get all assets in library
   *     tags: [Assets]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *         description: Asset library ID
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/:id/assets', authenticate, validateAssetLibraryId, assetController.getAllByLibrary);

  /**
   * @swagger
   * /api/assets/{assetId}:
   *   put:
   *     summary: Update an asset
   *     tags: [Assets]
   *     parameters:
   *       - in: path
   *         name: assetId
   *         required: true
   *         schema: { type: string, format: uuid }
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               image_path: { type: string }
   *               image_url: { type: string, format: uri }
   *               display_order: { type: integer, minimum: 0 }
   *     responses:
   *       200:
   *         description: OK
   */
  router.put('/assets/:assetId', authenticate, validateAssetId, validateUpdateAsset, assetController.update);

  /**
   * @swagger
   * /api/assets/{assetId}:
   *   delete:
   *     summary: Delete an asset
   *     tags: [Assets]
   *     parameters:
   *       - in: path
   *         name: assetId
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: OK
   */
  router.delete('/assets/:assetId', authenticate, validateAssetId, assetController.delete);

  return router;
};

const dataSource = connectDatabase;
const router = createAssetLibraryRouter(dataSource);

export default router;
