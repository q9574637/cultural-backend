import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  getAllRegistrations,
  getRegistrationById,
  createRegistration,
  updateRegistrationStatus,
  deleteRegistration,
  getRegistrationStats
} from '../controllers/registrationController.js';

const router = express.Router();

// Public routes
router.post('/', createRegistration);

// Protected routes (admin only)
router.get('/', auth, getAllRegistrations);
router.get('/stats', auth, getRegistrationStats);
router.get('/:id', auth, getRegistrationById);
router.put('/:id/status', auth, updateRegistrationStatus);
router.delete('/:id', auth, deleteRegistration);

export default router; 