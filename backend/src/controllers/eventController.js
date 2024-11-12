import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const event = new Event({
      title,
      description,
      date,
      location,
      organizer: req.user.id
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event' });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name')
      .populate('participants', 'name')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

export const enrollInEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.participants.includes(userId)) {
      return res.status(400).json({ message: 'Already enrolled in this event' });
    }

    event.participants.push(userId);
    await event.save();

    res.json({ message: 'Successfully enrolled in event' });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in event' });
  }
}; 