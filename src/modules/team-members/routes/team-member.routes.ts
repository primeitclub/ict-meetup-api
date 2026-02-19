import { Router } from 'express';
import { DataSource } from 'typeorm';
import { TeamMemberController } from '../controllers/team-member.controller';
import { validateRequestBody, validateRequestQuery, validateRequestParams } from '../../../shared/validators/request.validator';
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
  teamMemberIdParamSchema,
  teamMemberQuerySchema,
  createTeamCategorySchema,
  updateTeamCategorySchema,
  teamCategoryIdParamSchema,
  teamCategoryQuerySchema,
  createTeamMemberDesignationSchema,
  updateTeamMemberDesignationSchema,
  teamMemberDesignationIdParamSchema,
  teamMemberDesignationQuerySchema,
} from '../validators/team-member.validator';
import { createAuthenticate } from '../../../shared/middlewares/auth.middleware';

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
   *         application/json:
   *           schema:
   *             type: object
   *             required: [versionId, categoryId, designationId, name]
   *             properties:
   *               versionId: { type: string, format: uuid }
   *               categoryId: { type: string, format: uuid }
   *               designationId: { type: string, format: uuid }
   *               name: { type: string, minLength: 1, maxLength: 150 }
   *               role: { type: string, maxLength: 100 }
   *               designationOrder: { type: integer, minimum: 1, maximum: 15, default: 1 }
   *     responses:
   *       201:
   *         description: Created
   */
  router.post('/', authenticate, validateRequestBody(createTeamMemberSchema), controller.create);

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
   *     tags: [TeamMembers]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [type, name]
   *             properties:
   *               type: { type: string }
   *               name: { type: string, minLength: 1, maxLength: 150 }
   *               displayOrder: { type: integer, minimum: 1, maximum: 15, default: 1 }
   *     responses:
   *       201:
   *         description: Created
   */
  router.post('/category', authenticate, validateRequestBody(createTeamCategorySchema), controller.createForCategory);

  /**
   * @swagger
   * /api/team-members/category:
   *   get:
   *     summary: Get all team categories
   *     tags: [TeamMembers]
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/category', authenticate, validateRequestQuery(teamCategoryQuerySchema), controller.getAllForCategory);

  /**
   * @swagger
   * /api/team-members/category/{id}:
   *   put:
   *     summary: Update a team category
   *     tags: [TeamMembers]
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
   *               type: { type: string }
   *               name: { type: string, minLength: 1, maxLength: 150 }
   *               displayOrder: { type: integer, minimum: 1, maximum: 15, default: 1 }
   *     responses:
   *       200:
   *         description: OK
   */
  router.put('/category/:id', authenticate, validateRequestParams(teamCategoryIdParamSchema), validateRequestBody(updateTeamCategorySchema), controller.updateForCategory);

  /**
   * @swagger
   * /api/team-members/category/{id}:
   *   delete:
   *     summary: Delete a team category
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
  router.delete('/category/:id', authenticate, validateRequestParams(teamCategoryIdParamSchema), controller.deleteForCategory);


  /**
   * @swagger
   * /api/team-members/designation:
   *   post:
   *     summary: Create a new team member designation
   *     tags: [TeamMembers]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name]
   *             properties:
   *               name: { type: string, minLength: 1, maxLength: 150 }
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
   *     tags: [TeamMembers]
   *     responses:  
   *       200:
   *         description: OK
   * */
  router.get('/designation', authenticate, validateRequestQuery(teamMemberDesignationQuerySchema), controller.getAllForDesignation);

  /** 
   * @swagger
   * /api/team-members/designation/{id}:
   *   put:
   *     summary: Update a team member designation
   *     tags: [TeamMembers]
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
  router.put('/designation/:id', authenticate, validateRequestParams(teamMemberDesignationIdParamSchema), validateRequestBody(updateTeamMemberDesignationSchema), controller.updateForDesignation);

  /**
   * @swagger
   * /api/team-members/designation/{id}:
   *   delete:
   *     summary: Delete a team member designation
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
   *   put:
   *     summary: Update a team member
   *     tags: [TeamMembers]
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
   *               versionId: { type: string, format: uuid }
   *               categoryId: { type: string, format: uuid }
   *               designationId: { type: string, format: uuid }
   *               name: { type: string, minLength: 1, maxLength: 150 }
   *               role: { type: string, maxLength: 100 }
   *               designationOrder: { type: integer, minimum: 1, maximum: 15, default: 1 }
   *     responses:
   *       200:
   *         description: OK
   */
  router.put('/:id', authenticate, validateRequestParams(teamMemberIdParamSchema), validateRequestBody(updateTeamMemberSchema), controller.update);

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
