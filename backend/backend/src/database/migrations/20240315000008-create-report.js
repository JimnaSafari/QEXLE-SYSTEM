export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('Reports', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM('case', 'client', 'billing', 'task', 'calendar'),
      allowNull: false
    },
    parameters: {
      type: Sequelize.JSON,
      allowNull: true
    },
    format: {
      type: Sequelize.ENUM('pdf', 'excel', 'csv'),
      defaultValue: 'pdf'
    },
    status: {
      type: Sequelize.ENUM('pending', 'generated', 'failed'),
      defaultValue: 'pending'
    },
    filePath: {
      type: Sequelize.STRING,
      allowNull: true
    },
    generatedBy: {
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
  await queryInterface.dropTable('Reports');
}; 