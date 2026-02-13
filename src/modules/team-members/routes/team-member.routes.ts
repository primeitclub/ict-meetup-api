import { Router } from 'express';
import { TeamMemberController } from '../controllers/team-member.controller';
import { validateRequestBody, validateRequestQuery } from '../../../shared/validators/request.validator';
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
  teamMemberIdParamSchema,
  teamMemberQuerySchema,
} from '../validators/team-member.validator';
import { authenticate } from '../../../shared/middlewares/auth.middleware';

const router = Router();

const controller = new TeamMemberController();

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
 *             required: [versionId, categoryId, name]
 *             properties:
 *               versionId: { type: string, format: uuid }
 *               categoryId: { type: string, format: uuid }
 *               name: { type: string, minLength: 1, maxLength: 150 }
 *               designation: { type: string, maxLength: 150 }
 *               role: { type: string, maxLength: 100 }
 *               imagePath: { type: string }
 *               imageUrl: { type: string }
 *               socialLinks: { type: object, additionalProperties: { type: string } }
 *               displayOrder: { type: integer, minimum: 0, default: 0 }
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
 *       - in: query
 *         name: categoryId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', validateRequestQuery(teamMemberQuerySchema), controller.getAll);

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
router.get('/:id', controller.getById);

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
 *               name: { type: string, minLength: 1, maxLength: 150 }
 *               designation: { type: string, maxLength: 150 }
 *               role: { type: string, maxLength: 100 }
 *               imagePath: { type: string }
 *               imageUrl: { type: string }
 *               socialLinks: { type: object, additionalProperties: { type: string } }
 *               displayOrder: { type: integer, minimum: 0, default: 0 }
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/:id', authenticate, validateRequestBody(updateTeamMemberSchema), controller.update);

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
router.delete('/:id', authenticate, controller.delete);

export default router;
