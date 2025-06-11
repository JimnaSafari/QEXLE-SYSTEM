import { Case, Team, Document, Task } from '../models/index.js';
import { logger } from '../utils/logger.js';

// @desc    Create new case
// @route   POST /api/cases
// @access  Private
export const createCase = async (req, res) => {
  try {
    const {
      caseNumber,
      title,
      description,
      status,
      priority,
      clientName,
      clientEmail,
      clientPhone,
      assignedTo
    } = req.body;

    const newCase = await Case.create({
      caseNumber,
      title,
      description,
      status,
      priority,
      clientName,
      clientEmail,
      clientPhone,
      assignedTo,
      startDate: new Date()
    });

    res.status(201).json(newCase);
  } catch (error) {
    logger.error('Error in createCase:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all cases
// @route   GET /api/cases
// @access  Private
export const getCases = async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;
    const where = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;

    const cases = await Case.findAll({
      where,
      include: [
        {
          model: Team,
          as: 'assignedAttorney',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(cases);
  } catch (error) {
    logger.error('Error in getCases:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get case by ID
// @route   GET /api/cases/:id
// @access  Private
export const getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findByPk(req.params.id, {
      include: [
        {
          model: Team,
          as: 'assignedAttorney',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Document,
          as: 'documents'
        },
        {
          model: Task,
          as: 'tasks'
        }
      ]
    });

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json(caseData);
  } catch (error) {
    logger.error('Error in getCaseById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update case
// @route   PUT /api/cases/:id
// @access  Private
export const updateCase = async (req, res) => {
  try {
    const caseData = await Case.findByPk(req.params.id);

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const updatedCase = await caseData.update(req.body);
    res.json(updatedCase);
  } catch (error) {
    logger.error('Error in updateCase:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete case
// @route   DELETE /api/cases/:id
// @access  Private/Admin
export const deleteCase = async (req, res) => {
  try {
    const caseData = await Case.findByPk(req.params.id);

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    await caseData.destroy();
    res.json({ message: 'Case removed' });
  } catch (error) {
    logger.error('Error in deleteCase:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get case statistics
// @route   GET /api/cases/stats
// @access  Private
export const getCaseStats = async (req, res) => {
  try {
    const totalCases = await Case.count();
    const activeCases = await Case.count({ where: { status: 'active' } });
    const pendingCases = await Case.count({ where: { status: 'pending' } });
    const closedCases = await Case.count({ where: { status: 'closed' } });

    const casesByPriority = await Case.findAll({
      attributes: ['priority', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['priority']
    });

    res.json({
      totalCases,
      activeCases,
      pendingCases,
      closedCases,
      casesByPriority
    });
  } catch (error) {
    logger.error('Error in getCaseStats:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 