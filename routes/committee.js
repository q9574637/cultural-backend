import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  getAllCommitteeMembers,
  getCommitteeMemberById,
  createCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
  updateCommitteeMemberOrder
} from '../controllers/committeeController.js';

const router = express.Router();

// Public routes
router.get('/', getAllCommitteeMembers);
router.get('/:id', getCommitteeMemberById);

// Protected routes (super admin only)
router.post('/', auth, createCommitteeMember);
router.put('/:id', auth, updateCommitteeMember);
router.delete('/:id', auth, deleteCommitteeMember);
router.put('/order/update', auth, updateCommitteeMemberOrder);

export default router; 