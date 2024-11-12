import express from 'express';
import { createEvent, getEvents, enrollInEvent } from '../controllers/eventController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createEvent);
router.get('/', authenticateToken, getEvents);
router.post('/:id/enroll', authenticateToken, enrollInEvent);

export default router; 