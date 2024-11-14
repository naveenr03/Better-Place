import EmergencyContact from '../models/EmergencyContact.js';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const addEmergencyContact = async (req, res) => {
  try {
    const { name, phoneNumber, relationship } = req.body;
    const contact = new EmergencyContact({
      user: req.user.id,
      name,
      phoneNumber,
      relationship
    });
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error adding emergency contact' });
  }
};

export const getEmergencyContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ user: req.user.id });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching emergency contacts' });
  }
};

export const sendEmergencyAlert = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ user: req.user.id });
    const user = req.user;
    const location = req.body.location;

    const message = `EMERGENCY ALERT from ${user.name}! Location: ${location}. Please contact them immediately or alert authorities.`;

    const notifications = contacts.map(contact => 
      client.messages.create({
        body: message,
        to: contact.phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER
      })
    );

    await Promise.all(notifications);
    res.json({ message: 'Emergency alerts sent successfully' });
  } catch (error) {
    console.error('Emergency alert error:', error);
    res.status(500).json({ message: 'Error sending emergency alerts' });
  }
}; 