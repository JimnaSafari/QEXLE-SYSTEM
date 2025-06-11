import { Task, Team, Case } from '../models/index.js';
import { logger } from '../utils/logger.js';

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      caseId,
      dependencies
    } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      caseId,
      dependencies,
      createdBy: req.teamMember.id
    });

    res.status(201).json(task);
  } catch (error) {
    logger.error('Error in createTask:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo, caseId } = req.query;
    const where = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;
    if (caseId) where.caseId = caseId;

    const tasks = await Task.findAll({
      where,
      include: [
        {
          model: Team,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Team,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Case,
          as: 'case',
          attributes: ['id', 'caseNumber', 'title']
        }
      ],
      order: [['dueDate', 'ASC']]
    });

    res.json(tasks);
  } catch (error) {
    logger.error('Error in getTasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: Team,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Team,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Case,
          as: 'case',
          attributes: ['id', 'caseNumber', 'title']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    logger.error('Error in getTaskById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      dependencies,
      notes
    } = req.body;

    // If task is being marked as completed, set completedDate
    if (status === 'completed' && task.status !== 'completed') {
      req.body.completedDate = new Date();
    }

    const updatedTask = await task.update(req.body);
    res.json(updatedTask);
  } catch (error) {
    logger.error('Error in updateTask:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task removed' });
  } catch (error) {
    logger.error('Error in deleteTask:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = async (req, res) => {
  try {
    const totalTasks = await Task.count();
    const completedTasks = await Task.count({ where: { status: 'completed' } });
    const pendingTasks = await Task.count({ where: { status: 'pending' } });
    const inProgressTasks = await Task.count({ where: { status: 'in_progress' } });

    const tasksByPriority = await Task.findAll({
      attributes: ['priority', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['priority']
    });

    const overdueTasks = await Task.count({
      where: {
        status: { [Op.ne]: 'completed' },
        dueDate: { [Op.lt]: new Date() }
      }
    });

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      tasksByPriority
    });
  } catch (error) {
    logger.error('Error in getTaskStats:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 