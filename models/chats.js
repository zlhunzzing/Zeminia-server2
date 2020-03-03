'use strict';
const models = require('../models');
module.exports = (sequelize, DataTypes) => {
  const chats = sequelize.define(
    'chats',
    {
      character_id: DataTypes.INTEGER,
      message: DataTypes.STRING,
      roomname: DataTypes.STRING
    },
    {}
  );
  chats.associate = function(models) {
    // associations can be defined here
    models.chats.belongsTo(models.characters, {
      foreignKey: 'character_id'
    });
  };
  return chats;
};
