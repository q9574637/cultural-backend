import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', auth, getCurrentUser);

// Admin routes (super admin only)
router.get('/users', auth, getAllUsers);
router.get('/users/:id', auth, getUserById);
router.post('/users', auth, createUser);
router.put('/users/:id', auth, updateUser);
router.delete('/users/:id', auth, deleteUser);

export default router;
