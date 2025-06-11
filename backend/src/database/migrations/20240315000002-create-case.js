export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('Cases', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    caseNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
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
      type: Sequelize.ENUM('active', 'pending', 'closed', 'archived'),
      defaultValue: 'active'
    },
    priority: {
      type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    },
    clientName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    clientEmail: {
      type: Sequelize.STRING,
      allowNull: true
    },
    clientPhone: {
      type: Sequelize.STRING,
      allowNull: true
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    endDate: {
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
    notes: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    documents: {
      type: Sequelize.JSONB,
      defaultValue: []
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
  await queryInterface.dropTable('Cases');
}; 