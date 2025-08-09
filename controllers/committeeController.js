import CommitteeMember from '../models/CommitteeMember.js';

// Get all committee members
export const getAllCommitteeMembers = async (req, res) => {
  try {
    const members = await CommitteeMember.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get committee member by ID
export const getCommitteeMemberById = async (req, res) => {
  try {
    const member = await CommitteeMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Committee member not found' });
    }
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Create new committee member
export const createCommitteeMember = async (req, res) => {
  try {
    // Only super admin can create committee members
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Only super admin can create committee members' });
    }

    const newMember = new CommitteeMember(req.body);
    await newMember.save();

    res.status(201).json({ success: true, message: 'Committee member created successfully', data: newMember });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Update committee member
export const updateCommitteeMember = async (req, res) => {
  try {
    // Only super admin can update committee members
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Only super admin can update committee members' });
    }

    const member = await CommitteeMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Committee member not found' });
    }

    const updatedMember = await CommitteeMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, message: 'Committee member updated successfully', data: updatedMember });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Delete committee member
export const deleteCommitteeMember = async (req, res) => {
  try {
    // Only super admin can delete committee members
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Only super admin can delete committee members' });
    }

    const member = await CommitteeMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Committee member not found' });
    }

    await CommitteeMember.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Committee member deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Update committee member order
export const updateCommitteeMemberOrder = async (req, res) => {
  try {
    // Only super admin can update order
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Only super admin can update order' });
    }

    const { members } = req.body; // Array of { id, order }
    
    for (const member of members) {
      await CommitteeMember.findByIdAndUpdate(member.id, { order: member.order });
    }

    res.json({ success: true, message: 'Committee member order updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}; 