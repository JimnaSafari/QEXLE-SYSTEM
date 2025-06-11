export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('Cases', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    caseNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('open', 'closed', 'pending'),
      defaultValue: 'open'
    },
    priority: {
      type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    court: {
      type: Sequelize.STRING,
      allowNull: true
    },
    judge: {
      type: Sequelize.STRING,
      allowNull: true
    },
    opposingParty: {
      type: Sequelize.STRING,
      allowNull: true
    },
    opposingCounsel: {
      type: Sequelize.STRING,
      allowNull: true
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    nextHearingDate: {
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
    clientId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Clients',
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
  await queryInterface.dropTable('Cases');
}; 