import Event from '../models/Event.js';
import Crowdfunding from '../models/Crowdfunding.js';

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event' });
  }
};

export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Crowdfunding.find().populate('organizer', 'name');
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaigns' });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    await Crowdfunding.findByIdAndDelete(req.params.id);
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting campaign' });
  }
}; 