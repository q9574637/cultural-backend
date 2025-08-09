import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verify JWT token
export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET");
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid token or user deactivated"
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

// Check if user is super admin
export const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Super admin access required"
    });
  }
  next();
};

// Check if user is admin or super admin
export const requireAdmin = (req, res, next) => {
  if (!["admin", "super_admin"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });
  }
  next();
};

// Optional authentication (for public endpoints that can benefit from user context)
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET");
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

// Rate limiting for sensitive operations
export const rateLimit = (maxRequests = 10, windowMinutes = 15) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = req.ip + (req.user ? req.user._id : "anonymous");
    const now = Date.now();
    const windowStart = now - (windowMinutes * 60 * 1000);
    
    // Clean old requests
    const userRequests = requests.get(key) || [];
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later."
      });
    }
    
    validRequests.push(now);
    requests.set(key, validRequests);
    
    next();
  };
}; 