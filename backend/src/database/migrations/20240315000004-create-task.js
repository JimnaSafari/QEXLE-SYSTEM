export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('Tasks', {
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
    status: {
      type: Sequelize.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    priority: {
      type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    },
    dueDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    completedDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    assignedTo: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Teams',
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
    caseId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Cases',
        key: 'id'
      }
    },
    dependencies: {
      type: Sequelize.ARRAY(Sequelize.UUID),
      defaultValue: []
    },
    tags: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true
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
  await queryInterface.dropTable('Tasks');
}; 