import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { validateRequestBody, validateRequestQuery } from '../../../shared/validators/request.validator';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
  categoryQuerySchema,
} from '../validators/category.validator';

const router = Router();
const controller = new CategoryController();

// POST /api/categories
router.post('/',validateRequestBody(createCategorySchema),controller.create);

// GET /api/categories
router.get('/',validateRequestQuery(categoryQuerySchema),controller.getAll);

// GET /api/categories/:id
router.get('/:id',controller.getById);

// PUT /api/categories/:id
router.put('/:id',validateRequestBody(updateCategorySchema),controller.update
);

// DELETE /api/categories/:id
router.delete('/:id',controller.delete);

export default router;
