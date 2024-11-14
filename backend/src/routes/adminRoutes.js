import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { 
  getEvents, 
  deleteEvent, 
  getCampaigns, 
  deleteCampaign, 
  getUsers, 
  updateUserRole 
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/events', authenticateToken, isAdmin, getEvents);
router.delete('/events/:id', authenticateToken, isAdmin, deleteEvent);
router.get('/campaigns', authenticateToken, isAdmin, getCampaigns);
router.delete('/campaigns/:id', authenticateToken, isAdmin, deleteCampaign);
router.get('/users', authenticateToken, isAdmin, getUsers);
router.patch('/users/:id/role', authenticateToken, isAdmin, updateUserRole);

export default router; 