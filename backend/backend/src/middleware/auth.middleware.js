import jwt from 'jsonwebtoken';
import { Team } from '../models/team.model.js';

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { message: 'No token provided' }
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const teamMember = await Team.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!teamMember) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Add user to request object
    req.user = teamMember;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to access this route' }
      });
    }
    next();
  };
}; 