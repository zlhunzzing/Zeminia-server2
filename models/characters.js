'use strict';
var models = require('../models');
module.exports = (sequelize, DataTypes) => {
  const characters = sequelize.define(
    'characters',
    {
      level: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      maxHp: {
        type: DataTypes.INTEGER,
        defaultValue: 100
      },
      hp: {
        type: DataTypes.INTEGER,
        defaultValue: 100
      },
      att: {
        type: DataTypes.INTEGER,
        defaultValue: 5
      },
      exp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      user_id: DataTypes.INTEGER,
      character_name: DataTypes.STRING,
      def: DataTypes.INTEGER,
      rankScore: DataTypes.INTEGER,
      gold: DataTypes.INTEGER,
      mp: DataTypes.INTEGER,
      weapon: DataTypes.INTEGER,
      login_time: DataTypes.DATE,
      logout_time: DataTypes.DATE
    },
    {}
  );
  characters.associate = function(models) {
    // associations can be defined here
    models.characters.hasMany(models.chats, {
      foreignKey: 'character_id'
    });
  };
  characters.associate = function(models) {
    models.characters.belongsTo(models.items, {
      foreignKey: 'weapon'
    });
  };
  return characters;
};
