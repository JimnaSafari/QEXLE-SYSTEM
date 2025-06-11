export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('Documents', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    filePath: {
      type: Sequelize.STRING,
      allowNull: false
    },
    fileType: {
      type: Sequelize.STRING,
      allowNull: false
    },
    fileSize: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    category: {
      type: Sequelize.ENUM('pleading', 'motion', 'brief', 'evidence', 'correspondence', 'other'),
      defaultValue: 'other'
    },
    status: {
      type: Sequelize.ENUM('draft', 'final', 'archived'),
      defaultValue: 'draft'
    },
    version: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    uploadedBy: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Teams',
        key: 'id'
      }
    },
    caseId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Cases',
        key: 'id'
      }
    },
    metadata: {
      type: Sequelize.JSONB,
      defaultValue: {}
    },
    tags: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('Documents');
}; 