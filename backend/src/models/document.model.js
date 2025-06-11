import { DataTypes } from 'sequelize';
import { sequelize } from '../database/config.js';
import { Case } from './case.model.js';
import { Team } from './team.model.js';

export const Document = sequelize.define('Document', {
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
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('pleading', 'motion', 'brief', 'evidence', 'correspondence', 'other'),
    defaultValue: 'other'
  },
  status: {
    type: DataTypes.ENUM('draft', 'final', 'archived'),
    defaultValue: 'draft'
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  uploadedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Team,
      key: 'id'
    }
  },
  caseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Case,
      key: 'id'
    }
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
});

// Define associations
Document.belongsTo(Team, { foreignKey: 'uploadedBy', as: 'uploader' });
Document.belongsTo(Case, { foreignKey: 'caseId', as: 'case' }); 