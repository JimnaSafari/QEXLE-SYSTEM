import { DataTypes } from 'sequelize';
import { sequelize } from '../database/config.js';
import { Case } from './case.model.js';
import { Team } from './team.model.js';

export const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Team,
      key: 'id'
    }
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Team,
      key: 'id'
    }
  },
  caseId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Case,
      key: 'id'
    }
  },
  dependencies: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Define associations
Task.belongsTo(Team, { foreignKey: 'assignedTo', as: 'assignee' });
Task.belongsTo(Team, { foreignKey: 'createdBy', as: 'creator' });
Task.belongsTo(Case, { foreignKey: 'caseId', as: 'case' }); 