import { Event, Registration } from '../models/index.js';

// Create new event
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      maxParticipants,
      registrationDeadline,
      imageUrl
    } = req.body;

    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      location,
      category,
      maxParticipants: parseInt(maxParticipants) || 0,
      registrationDeadline,
      imageUrl,
      createdBy: req.user.userId,
      status: 'active',
      currentParticipants: 0
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const { category, status = 'active' } = req.query;
    
    let filter = { status };
    if (category) {
      filter.category = category;
    }

    const events = await Event.find(filter);

    res.json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData);
    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// Register for event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.userId;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      eventId,
      userId
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event'
      });
    }

    // Check if event is full
    if (event.maxParticipants > 0 && event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Create registration
    const registration = await Registration.create({
      eventId,
      userId,
      registrationDate: new Date().toISOString(),
      status: 'confirmed'
    });

    // Update event participant count
    await Event.findByIdAndUpdate(eventId, {
      currentParticipants: (parseInt(event.currentParticipants) || 0) + 1
    });

    res.status(201).json({
      success: true,
      message: 'Successfully registered for event',
      data: registration
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for event',
      error: error.message
    });
  }
};
