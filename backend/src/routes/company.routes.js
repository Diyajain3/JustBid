import express from 'express';
import { createOrUpdateProfile, getProfile } from '../controllers/company.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.post('/profile', protect, createOrUpdateProfile);

export default router;
