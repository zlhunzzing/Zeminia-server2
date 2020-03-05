'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('characters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      level: {
        type: Sequelize.INTEGER
      },
      character_name: {
        type: Sequelize.STRING
      },
      maxHp: {
        type: Sequelize.INTEGER
      },
      hp: {
        type: Sequelize.INTEGER
      },
      att: {
        type: Sequelize.INTEGER
      },
      def: {
        type: Sequelize.INTEGER
      },
      exp: {
        type: Sequelize.INTEGER
      },
      rankScore: {
        type: Sequelize.INTEGER
      },
      gold: {
        type: Sequelize.INTEGER
      },
      mp: {
        type: Sequelize.INTEGER
      },
      weapon: {
        type: Sequelize.INTEGER
      },
      login_time: {
        type: Sequelize.DATE
      },
      logout_time: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('characters');
  }
};
