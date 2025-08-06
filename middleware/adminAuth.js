// Middleware to check if user is admin or super admin
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

// Middleware to check if user is super admin only
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Super admin access required' });
  }

  next();
};

// Middleware to check if user can access specific event
export const requireEventAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Super admin can access everything
  if (req.user.role === 'super_admin') {
    return next();
  }

  // Admin can only access their assigned event
  if (req.user.role === 'admin' && req.user.assignedEventId) {
    const eventId = req.params.eventId || req.body.eventId;
    if (eventId && req.user.assignedEventId.toString() !== eventId.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this event' });
    }
    return next();
  }

  return res.status(403).json({ message: 'Not authorized' });
}; 