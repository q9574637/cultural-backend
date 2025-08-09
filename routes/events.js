import express from 'express';
import { 
  createEvent, 
  getAllEvents, 
  getEventById, 
  updateEvent, 
  deleteEvent, 
  registerForEvent 
} from '../controllers/eventController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected routes
router.post('/', authenticateToken, authorizeRoles('admin', 'committee'), createEvent);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'committee'), updateEvent);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'committee'), deleteEvent);

// Event registration
router.post('/:eventId/register', authenticateToken, registerForEvent);

export default router;
