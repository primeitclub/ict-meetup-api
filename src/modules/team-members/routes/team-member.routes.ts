import { Router } from 'express';
import { TeamMemberController } from '../controllers/team-member.controller';
import { validateRequestBody, validateRequestQuery } from '../../../shared/validators/request.validator';
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
  teamMemberIdParamSchema,
  teamMemberQuerySchema,
} from '../validators/team-member.validator';

const router = Router();
const controller = new TeamMemberController();

// POST /api/team-members
router.post('/',validateRequestBody(createTeamMemberSchema),controller.create);

// GET /api/team-members
router.get('/',validateRequestQuery(teamMemberQuerySchema),controller.getAll);

// GET /api/team-members/:id
router.get( '/:id',controller.getById);

// PUT /api/team-members/:id
router.put('/:id',validateRequestBody(updateTeamMemberSchema),controller.update);

// DELETE /api/team-members/:id
router.delete('/:id',controller.delete);

export default router;
