import express from 'express';
import { createTeam, getMyTeams, inviteToTeam, removeFromTeam, deleteTeam } from '../controllers/team.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createTeam);
router.get('/', protect, getMyTeams);
router.post('/invite', protect, inviteToTeam);
router.delete('/:teamId', protect, deleteTeam);
router.delete('/:teamId/members/:userId', protect, removeFromTeam);

export default router;
