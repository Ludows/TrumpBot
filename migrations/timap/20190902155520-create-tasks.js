'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      task_identifier: {
        type: Sequelize.STRING
      },
      task_id: {
        type: Sequelize.STRING
      },
      task: {
        type: Sequelize.STRING
      },
      hour: {
        type: Sequelize.FLOAT
      },
      day: {
        type: Sequelize.DATEONLY
      },
      username: {
        type: Sequelize.STRING
      },
      operateur_id: {
        type: Sequelize.INTEGER
      },
      timestamp: {
        type: Sequelize.INTEGER      
      },
      search: {
        type: Sequelize.STRING
      },
      client_id: {
        type: Sequelize.INTEGER
      },
      folder: {
        type: Sequelize.STRING
      },
      action_id: {
        type: Sequelize.INTEGER
      },
      commentaire: {
        type: Sequelize.STRING
      },
      projet_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tasks');
  }
};