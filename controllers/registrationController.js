import EventRegistration from '../models/EventRegistration.js';
import Event from '../models/Events.js';

// Get all registrations (admin only)
export const getAllRegistrations = async (req, res) => {
  try {
    let registrations;
    
    if (req.user.role === 'admin' && req.user.assignedEventId) {
      // Admin assigned to specific event - show only their event registrations
      registrations = await EventRegistration.find({ 
        eventId: req.user.assignedEventId 
      }).sort({ registrationDate: -1 });
    } else if (req.user.role === 'super_admin') {
      // Super admin can see all registrations
      registrations = await EventRegistration.find().sort({ registrationDate: -1 });
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get registration by ID
export const getRegistrationById = async (req, res) => {
  try {
    const registration = await EventRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    // Check if user has permission to view this registration
    if (req.user.role === 'admin' && req.user.assignedEventId?.toString() !== registration.eventId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this registration' });
    }

    res.json({ success: true, data: registration });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Create new registration
export const createRegistration = async (req, res) => {
  try {
    const { eventId, ...registrationData } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if event is active
    if (event.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Event registration is not open' });
    }

    // Check if registration deadline has passed
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return res.status(400).json({ success: false, message: 'Registration deadline has passed' });
    }

    // Check if max participants reached
    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    // Check if user already registered for this event
    const existingRegistration = await EventRegistration.findOne({
      email: registrationData.email,
      eventId: eventId
    });

    if (existingRegistration) {
      return res.status(400).json({ success: false, message: 'You are already registered for this event' });
    }

    const newRegistration = new EventRegistration({
      ...registrationData,
      eventId,
      eventName: event.title,
      registrationDate: new Date()
    });

    await newRegistration.save();

    // Update event participant count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { currentParticipants: 1, 'stats.totalRegistrations': 1 }
    });

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful', 
      data: newRegistration 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Update registration status
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const registration = await EventRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    // Check if user has permission to update this registration
    if (req.user.role === 'admin' && req.user.assignedEventId?.toString() !== registration.eventId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this registration' });
    }

    const updateData = { status, notes };
    
    // Add timestamps for status changes
    if (status === 'attended') {
      updateData.attendedAt = new Date();
    } else if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
      updateData.cancelledBy = req.user.id;
    }

    const updatedRegistration = await EventRegistration.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ success: true, message: 'Registration status updated successfully', data: updatedRegistration });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Delete registration
export const deleteRegistration = async (req, res) => {
  try {
    const registration = await EventRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    // Only super admin can delete registrations
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Only super admin can delete registrations' });
    }

    await EventRegistration.findByIdAndDelete(req.params.id);

    // Update event participant count
    await Event.findByIdAndUpdate(registration.eventId, {
      $inc: { currentParticipants: -1, 'stats.totalRegistrations': -1 }
    });

    res.json({ success: true, message: 'Registration deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get registration statistics
export const getRegistrationStats = async (req, res) => {
  try {
    let stats;
    
    if (req.user.role === 'admin' && req.user.assignedEventId) {
      // Admin stats for their assigned event
      const totalRegistrations = await EventRegistration.countDocuments({ 
        eventId: req.user.assignedEventId 
      });
      const paidRegistrations = await EventRegistration.countDocuments({ 
        eventId: req.user.assignedEventId,
        paymentStatus: 'paid'
      });
      const pendingRegistrations = await EventRegistration.countDocuments({ 
        eventId: req.user.assignedEventId,
        paymentStatus: 'pending'
      });
      
      stats = {
        totalRegistrations,
        paidRegistrations,
        pendingRegistrations,
        unpaidRegistrations: totalRegistrations - paidRegistrations
      };
    } else if (req.user.role === 'super_admin') {
      // Super admin stats for all events
      const totalRegistrations = await EventRegistration.countDocuments();
      const paidRegistrations = await EventRegistration.countDocuments({ paymentStatus: 'paid' });
      const pendingRegistrations = await EventRegistration.countDocuments({ paymentStatus: 'pending' });
      
      stats = {
        totalRegistrations,
        paidRegistrations,
        pendingRegistrations,
        unpaidRegistrations: totalRegistrations - paidRegistrations
      };
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}; 