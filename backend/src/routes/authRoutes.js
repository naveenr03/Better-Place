import express from 'express';
import { register, login } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkAdmin } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/check-admin', authenticateToken, checkAdmin);

export default router; 