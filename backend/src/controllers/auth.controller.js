import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Team } from '../models/index.js';
import { logger } from '../utils/logger.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// @desc    Register new team member
// @route   POST /api/auth/register
// @access  Private/Admin
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, department, phone } = req.body;

    // Check if team member exists
    const teamMemberExists = await Team.findOne({ where: { email } });
    if (teamMemberExists) {
      return res.status(400).json({ message: 'Team member already exists' });
    }

    // Create team member
    const teamMember = await Team.create({
      firstName,
      lastName,
      email,
      password,
      role,
      department,
      phone
    });

    if (teamMember) {
      res.status(201).json({
        id: teamMember.id,
        firstName: teamMember.firstName,
        lastName: teamMember.lastName,
        email: teamMember.email,
        role: teamMember.role,
        department: teamMember.department,
        phone: teamMember.phone,
        token: generateToken(teamMember.id)
      });
    }
  } catch (error) {
    logger.error('Error in register:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login team member
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for team member
    const teamMember = await Team.findOne({ where: { email } });
    if (!teamMember) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, teamMember.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await teamMember.update({ lastLogin: new Date() });

    res.json({
      id: teamMember.id,
      firstName: teamMember.firstName,
      lastName: teamMember.lastName,
      email: teamMember.email,
      role: teamMember.role,
      department: teamMember.department,
      phone: teamMember.phone,
      token: generateToken(teamMember.id)
    });
  } catch (error) {
    logger.error('Error in login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get team member profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const teamMember = await Team.findByPk(req.teamMember.id, {
      attributes: { exclude: ['password'] }
    });

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json(teamMember);
  } catch (error) {
    logger.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update team member profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, department } = req.body;
    const teamMember = await Team.findByPk(req.teamMember.id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Update fields
    teamMember.firstName = firstName || teamMember.firstName;
    teamMember.lastName = lastName || teamMember.lastName;
    teamMember.email = email || teamMember.email;
    teamMember.phone = phone || teamMember.phone;
    teamMember.department = department || teamMember.department;

    await teamMember.save();

    res.json({
      id: teamMember.id,
      firstName: teamMember.firstName,
      lastName: teamMember.lastName,
      email: teamMember.email,
      role: teamMember.role,
      department: teamMember.department,
      phone: teamMember.phone
    });
  } catch (error) {
    logger.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const teamMember = await Team.findByPk(req.teamMember.id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, teamMember.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    teamMember.password = newPassword;
    await teamMember.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    logger.error('Error in changePassword:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 