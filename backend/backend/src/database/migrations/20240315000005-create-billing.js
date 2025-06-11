export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('Billings', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    invoiceNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('pending', 'paid', 'overdue', 'cancelled'),
      defaultValue: 'pending'
    },
    dueDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    paymentDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    paymentMethod: {
      type: Sequelize.STRING,
      allowNull: true
    },
    clientId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Clients',
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
  await queryInterface.dropTable('Billings');
}; 