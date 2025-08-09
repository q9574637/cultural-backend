import Event from '../models/Events.js';

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "active" }).sort({ createdAt: -1 });
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Create new event
export const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.user.id // Set the current user as organizer
    };

    const newEvent = new Event(eventData);
    await newEvent.save();

    res.status(201).json({ success: true, message: 'Event created successfully', data: newEvent });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if user has permission to update this event
    if (req.user.role !== 'super_admin' && event.organizer?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, message: 'Event updated successfully', data: updatedEvent });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Only super admin can delete events
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Only super admin can delete events' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get events by category
export const getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const events = await Event.find({ 
      category, 
      status: "active" 
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get events for admin (filtered by assigned event if admin)
export const getEventsForAdmin = async (req, res) => {
  try {
    let events;
    
    if (req.user.role === 'admin' && req.user.assignedEventId) {
      // Admin assigned to specific event
      events = await Event.find({ 
        _id: req.user.assignedEventId,
        status: "active" 
      });
    } else if (req.user.role === 'super_admin') {
      // Super admin can see all events
      events = await Event.find().sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}; 