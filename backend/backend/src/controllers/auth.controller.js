import { Team } from '../models/team.model.js';
import { logger } from '../utils/logger.js';

// @desc    Register new team member
// @route   POST /api/auth/register
// @access  Private/Admin
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, department, phone } = req.body;

    // Check if team member already exists
    const existingMember = await Team.findOne({ where: { email } });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email already registered' }
      });
    }

    // Create new team member
    const teamMember = await Team.create({
      firstName,
      lastName,
      email,
      password,
      role,
      department,
      phone
    });

    // Generate token
    const token = teamMember.generateAuthToken();

    res.status(201).json({
      success: true,
      data: {
        id: teamMember.id,
        firstName: teamMember.firstName,
        lastName: teamMember.lastName,
        email: teamMember.email,
        role: teamMember.role,
        department: teamMember.department,
        phone: teamMember.phone,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login team member
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for team member
    const teamMember = await Team.findOne({ where: { email } });
    if (!teamMember) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' }
      });
    }

    // Check if password matches
    const isMatch = await teamMember.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' }
      });
    }

    // Update last login
    teamMember.lastLogin = new Date();
    await teamMember.save();

    // Generate token
    const token = teamMember.generateAuthToken();

    res.json({
      success: true,
      data: {
        id: teamMember.id,
        firstName: teamMember.firstName,
        lastName: teamMember.lastName,
        email: teamMember.email,
        role: teamMember.role,
        department: teamMember.department,
        phone: teamMember.phone,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in team member
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const teamMember = await Team.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    next(error);
  }
}; 