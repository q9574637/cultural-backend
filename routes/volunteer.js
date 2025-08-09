import express from 'express';
import { auth } from '../middleware/auth.js';
import { registerVolunteer, getVolunteers, updateStatus } from '../controllers/volunteerController.js';
const router = express.Router();

// Routes
router.post('/register', registerVolunteer);
router.get('/', getVolunteers);
router.put('/status/:id', updateStatus);


export default router;