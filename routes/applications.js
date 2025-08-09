import express from 'express';
import { auth } from '../middleware/auth.js';
import { acceptApplication } from '../controllers/applicationController.js';

const router = express.Router();

// Protected routes (admin only)
router.put('/accept/:id', auth, acceptApplication);

export default router;
