import { DataTypes } from 'sequelize';
import { sequelize } from '../database/config.js';

export const Leave = sequelize.define('Leave', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  teamMemberId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Teams',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('annual', 'sick', 'unpaid', 'other'),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in days'
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
    defaultValue: 'pending'
  },
  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Teams',
      key: 'id'
    }
  },
  approvalDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  approvalNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['teamMemberId']
    },
    {
      fields: ['status']
    }
  ]
}); 