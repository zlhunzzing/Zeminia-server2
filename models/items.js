'use strict';
var models = require('../models');
module.exports = (sequelize, DataTypes) => {
  const items = sequelize.define(
    'items',
    {
      item: DataTypes.STRING,
      att: DataTypes.INTEGER,
      def: DataTypes.INTEGER,
      cost: DataTypes.INTEGER
    },
    {}
  );
  items.associate = function(models) {
    // associations can be defined here
    models.items.hasMany(models.monsters_items, {
      foreignKey: 'item_id'
    });
  };
  items.associate = function(models) {
    models.items.hasMany(models.characters, {
      foreignKey: 'weapon'
    });
  };
  return items;
};
