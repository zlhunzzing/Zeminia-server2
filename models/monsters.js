'use strict';
var models = require('../models');
module.exports = (sequelize, DataTypes) => {
  const monsters = sequelize.define(
    'monsters',
    {
      monster_name: DataTypes.STRING,
      level: DataTypes.INTEGER,
      hp: DataTypes.INTEGER,
      att: DataTypes.INTEGER,
      exp: DataTypes.INTEGER,
      drop: DataTypes.STRING,
      img: DataTypes.STRING
    },
    {}
  );
  monsters.associate = function(models) {
    // associations can be defined here
    models.monsters.hasMany(models.monsters_items, {
      foreignKey: 'monster_id'
    });
  };
  return monsters;
};
