export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('Calendars', {
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
    startDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM('hearing', 'meeting', 'deadline', 'other'),
      allowNull: false
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('scheduled', 'completed', 'cancelled'),
      defaultValue: 'scheduled'
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
    assignedTo: {
      type: Sequelize.UUID,
      allowNull: true,
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
  await queryInterface.dropTable('Calendars');
}; 