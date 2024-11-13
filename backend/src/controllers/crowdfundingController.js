import Crowdfunding from '../models/Crowdfunding.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

// Add better error handling for Stripe initialization
let stripe;
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
  }
  
  if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    throw new Error('Invalid Stripe secret key format. Key should start with "sk_"');
  }

  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} catch (error) {
  console.error('Stripe initialization error:', error.message);
  // Don't throw here - let the application start, but payment functions will fail
}

console.log('Stripe Key Status:', {
  secretKeyExists: !!process.env.STRIPE_SECRET_KEY,
  secretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7),
  secretKeyLength: process.env.STRIPE_SECRET_KEY?.length
});

export const createCampaign = async (req, res) => {
  try {
    const { title, description, targetAmount, endDate } = req.body;
    const campaign = new Crowdfunding({
      title,
      description,
      targetAmount,
      endDate,
      organizer: req.user.id
    });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Error creating campaign' });
  }
};

export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Crowdfunding.find()
      .populate('organizer', 'name')
      .sort({ endDate: 1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaigns' });
  }
};

export const createPaymentIntent = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ 
        message: 'Stripe is not properly configured',
        error: 'Stripe initialization failed' 
      });
    }

    const { amount, campaignId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!campaignId) {
      return res.status(400).json({ message: 'Campaign ID is required' });
    }

    const campaign = await Crowdfunding.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents and ensure integer
      currency: 'usd',
      metadata: { campaignId },
      description: `Donation to ${campaign.title}`
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({ 
      message: 'Error creating payment intent',
      error: error.message,
      // Add more detailed error info for debugging
      details: process.env.NODE_ENV === 'development' ? {
        type: error.type,
        code: error.code,
        statusCode: error.statusCode
      } : undefined
    });
  }
};

export const handleDonation = async (req, res) => {
  try {
    const { campaignId, amount } = req.body;
    const campaign = await Crowdfunding.findById(campaignId);
    
    campaign.currentAmount += amount;
    campaign.donors.push({
      user: req.user.id,
      amount
    });
    
    if (campaign.currentAmount >= campaign.targetAmount) {
      campaign.status = 'completed';
    }
    
    await campaign.save();
    res.json({ message: 'Donation successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing donation' });
  }
};