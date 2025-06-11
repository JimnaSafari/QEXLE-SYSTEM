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
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    filePath: {
      type: Sequelize.STRING,
      allowNull: false
    },
    fileSize: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    mimeType: {
      type: Sequelize.STRING,
      allowNull: false
    },
    version: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    status: {
      type: Sequelize.ENUM('draft', 'final', 'archived'),
      defaultValue: 'draft'
    },
    caseId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Cases',
        key: 'id'
      }
    },
    clientId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Clients',
        key: 'id'
      }
    },
    createdBy: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Teams',
        key: 'id'
      }
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