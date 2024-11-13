import express from 'express';
import { createCampaign, getCampaigns, createPaymentIntent, handleDonation } from '../controllers/crowdfundingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createCampaign);
router.get('/', authenticateToken, getCampaigns);
router.post('/create-payment-intent', authenticateToken, createPaymentIntent);
router.post('/donate', authenticateToken, handleDonation);

export default router; 