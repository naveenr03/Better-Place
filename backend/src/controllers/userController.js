import User from '../models/User.js';
import Event from '../models/Event.js';
import Crowdfunding from '../models/Crowdfunding.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const getUserEvents = async (req, res) => {
  try {
    const enrolledEvents = await Event.find({
      participants: req.user.id
    }).populate('organizer', 'name');

    const organizedEvents = await Event.find({
      organizer: req.user.id
    });

    res.json({ enrolledEvents, organizedEvents });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

export const getUserCampaigns = async (req, res) => {
  try {
    const campaigns = await Crowdfunding.find({
      organizer: req.user.id
    });

    const donations = await Crowdfunding.find({
      'donations.donor': req.user.id
    });

    res.json({ campaigns, donations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaigns' });
  }
}; 