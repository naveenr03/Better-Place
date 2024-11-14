import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
  addEmergencyContact, 
  getEmergencyContacts, 
  sendEmergencyAlert 
} from '../controllers/emergencyController.js';

const router = express.Router();

router.post('/contacts', authenticateToken, addEmergencyContact);
router.get('/contacts', authenticateToken, getEmergencyContacts);
router.post('/alert', authenticateToken, sendEmergencyAlert);

export default router; 