import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByCategory,
  getEventsForAdmin
} from '../controllers/eventController.js';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/category/:category', getEventsByCategory);
router.get('/:id', getEventById);

// Protected routes
router.get('/admin/events', auth, getEventsForAdmin);
router.post('/', auth, createEvent);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);

export default router; 