import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getUserProfile,
  getUserEvents,
  getUserCampaigns
} from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', authenticateToken, getUserProfile);
router.get('/events', authenticateToken, getUserEvents);
router.get('/campaigns', authenticateToken, getUserCampaigns);

export default router; 