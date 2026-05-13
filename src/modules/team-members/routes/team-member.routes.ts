import { Router } from 'express';
import { DataSource } from 'typeorm';
import { TeamMemberController } from '../controllers/team-member.controller';
import { validateRequestBody, validateRequestQuery, validateRequestParams } from '../../../shared/validators/request.validator';
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
  teamMemberIdParamSchema,
  teamMemberQuerySchema,
  createTeamMemberDesignationSchema,
  updateTeamMemberDesignationSchema,
  teamMemberDesignationIdParamSchema,
  teamMemberDesignationQuerySchema,
} from '../validators/team-member.validator';
import { createAuthenticate } from '../../../shared/middlewares/auth.middleware';
import { imageUploadHandler } from '../../../shared/utils/helpers/imageUpload.helper';
import { categoryIdParamSchema, categoryQuerySchema, createCategorySchema, updateCategorySchema } from '../../category/validators/category.validator';

const createTeamMemberRouter = (dataSource: DataSource) => {
  const router = Router();
  const controller = new TeamMemberController(dataSource);
  const authenticate = createAuthenticate(dataSource);

  /**
   * @swagger
   * /api/team-members:
   *   post:
   *     summary: Create a new team member
   *     tags: [TeamMembers]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required: [versionId, categoryId, designationId, name, image]
   *             properties:
   *               versionId: { type: string, format: uuid }
   *               categoryId: { type: string, format: uuid }
   *               designationId: { type: string, format: uuid }
   *               name: { type: string, minLength: 1, maxLength: 150 }
   *               displayOrder: { type: integer, minimum: 1 }
   *               image: { type: string, format: binary }
   *               socialLinks:
   *                 type: object
   *                 properties:
   *                   instagram: { type: string, format: uri, pattern: "^https://" }
   *                   linkedin: { type: string, format: uri, pattern: "^https://" }
   *                   portfolio: { type: string, format: uri, pattern: "^https://" }
   *     responses:
   *       201:
   *         description: Created
   */
  router.post('/', authenticate, imageUploadHandler({ fieldName: 'image', multiple: false }), validateRequestBody(createTeamMemberSchema), controller.create);

  /**
   * @swagger
   * /api/team-members:
   *   get:
   *     summary: Get all team members
   *     tags: [TeamMembers]
   *     parameters:
   *       - in: query
   *         name: versionId
   *         schema: { type: string, format: uuid }
   *       - in: query
   *         name: categoryId
   *         schema: { type: string, format: uuid }
   *       - in: query
   *         name: page
   *         schema: { type: number, default: 1 }
   *       - in: query
   *         name: limit
   *         schema: { type: number, default: 10}
   *       - in: query
   *         name: search
   *         schema: { type: string }
   *       - in: query
   *         name: sortBy
   *         schema: { type: string }
   *       - in: query
   *         name: sortOrder
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/', validateRequestQuery(teamMemberQuerySchema), controller.getAll);

  /**
   * @swagger
   * /api/team-members/category:
   *   post:
   *     summary: Create a new team category
   *     tags: [TeamMemberCategories]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, displayName]
   *             properties:
   *               name: { type: string, minLength: 1, maxLength: 150 }
   *               displayName: { type: string, minLength: 1, maxLength: 150 }
   *               displayOrder: { type: integer, minimum: 1}
   *     responses:
   *       201:
   *         description: Created
   */
  router.post('/category', authenticate, validateRequestBody(createCategorySchema), controller.createForCategory);

  /**
   * @swagger
   * /api/team-members/category:
   *   get:
   *     summary: Get all team categories
   *     tags: [TeamMemberCategories]
   *     parameters: 
   *       - in: query
   *         name: page
   *         schema: { type: number , default: 1 }
   *       - in: query
   *         name: limit
   *         schema: { type: number , default: 10 }
   *       - in: query
   *         name: search
   *         schema: { type: string }
   *       - in: query
   *         name: sortBy
   *         schema: { type: string }
   *       - in: query
   *         name: sortOrder
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/category', validateRequestQuery(categoryQuerySchema), controller.getAllForCategory);

  /**
   * @swagger
   * /api/team-members/category/{id}:
   *   patch:
   *     summary: Update a team category
   *     tags: [TeamMemberCategories]
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
   *               name: { type: string, minLength: 1, maxLength: 150 }
   *               displayName: { type: string, minLength: 1, maxLength: 150 }
   *               displayOrder: { type: integer, minimum: 1}
   *     responses:
   *       200:
   *         description: OK
   */
  router.patch('/category/:id', authenticate, validateRequestParams(categoryIdParamSchema), validateRequestBody(updateCategorySchema), controller.updateForCategory);

  /**
   * @swagger
   * /api/team-members/category/{id}:
   *   delete:
   *     summary: Delete a team category
   *     tags: [TeamMemberCategories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: OK
   */
  router.delete('/category/:id', authenticate, validateRequestParams(categoryIdParamSchema), controller.deleteForCategory);


  /**
   * @swagger
   * /api/team-members/designation:
   *   post:
   *     summary: Create a new team member designation
   *     tags: [TeamMemberDesignations]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, versionId]
   *             properties:
   *               name: { type: string, minLength: 1, maxLength: 150 }
   *               versionId: { type: string, format: uuid }
   *     responses:
   *       201:
   *         description: Created
   */
  router.post('/designation', authenticate, validateRequestBody(createTeamMemberDesignationSchema), controller.createForDesignation);

  /**
   * @swagger
   * /api/team-members/designation:
   *   get:
   *     summary: Get all team member designations
   *     tags: [TeamMemberDesignations]
   *     parameters: 
   *       - in: query
   *         name: page
   *         schema: { type: number , default: 1}
   *       - in: query
   *         name: limit
   *         schema: { type: number , default: 10}
   *       - in: query
   *         name: search
   *         schema: { type: string }
   *       - in: query
   *         name: sortBy
   *         schema: { type: string }
   *       - in: query
   *         name: sortOrder
   *         schema: { type: string }
   *     responses:  
   *       200:
   *         description: OK
   * */
  router.get('/designation', validateRequestQuery(teamMemberDesignationQuerySchema), controller.getAllForDesignation);

  /** 
   * @swagger
   * /api/team-members/designation/{id}:
   *   patch:
   *     summary: Update a team member designation
   *     tags: [TeamMemberDesignations]
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
   *               name: { type: string, minLength: 1, maxLength: 150 }
   *     responses:
   *       200:
   *         description: OK
   * */
  router.patch('/designation/:id', authenticate, validateRequestParams(teamMemberDesignationIdParamSchema), validateRequestBody(updateTeamMemberDesignationSchema), controller.updateForDesignation);

  /**
   * @swagger
   * /api/team-members/designation/{id}:
   *   delete:
   *     summary: Delete a team member designation
   *     tags: [TeamMemberDesignations]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: OK
   */
  router.delete('/designation/:id', authenticate, validateRequestParams(teamMemberDesignationIdParamSchema), controller.deleteForDesignation);

  /**
   * @swagger
   * /api/team-members/{id}:
   *   get:
   *     summary: Get team member by ID
   *     tags: [TeamMembers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/:id', validateRequestParams(teamMemberIdParamSchema), controller.getById);

  /**
   * @swagger
   * /api/team-members/{id}:
   *   patch:
   *     summary: Update a team member
   *     tags: [TeamMembers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               versionId: { type: string, format: uuid }
   *               categoryId: { type: string, format: uuid }
   *               designationId: { type: string, format: uuid }
   *               name: { type: string, minLength: 1, maxLength: 150 }
   *               displayOrder: { type: integer, minimum: 1 }
   *               image: { type: string, format: binary }
   *               socialLinks:
   *                 type: object
   *                 properties:
   *                   instagram: { type: string, format: uri, pattern: "^https://" }
   *                   linkedin: { type: string, format: uri, pattern: "^https://" }
   *                   portfolio: { type: string, format: uri, pattern: "^https://" }
   *     responses:
   *       200:
   *         description: OK
   */
  router.patch('/:id', authenticate, imageUploadHandler({ fieldName: 'image', multiple: false }), validateRequestParams(teamMemberIdParamSchema), validateRequestBody(updateTeamMemberSchema), controller.update);

  /**
   * @swagger
   * /api/team-members/{id}:
   *   delete:
   *     summary: Delete a team member
   *     tags: [TeamMembers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: OK
   */
  router.delete('/:id', authenticate, validateRequestParams(teamMemberIdParamSchema), controller.delete);
  return router;
};

export default createTeamMemberRouter;
