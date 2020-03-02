'use strict';
module.exports = (sequelize, DataTypes) => {
  const monsters_items = sequelize.define(
    'monsters_items',
    {
      monster_id: DataTypes.INTEGER,
      item_id: DataTypes.INTEGER
    },
    {}
  );
  monsters_items.associate = function(models) {
    // associations can be defined here
  };
  return monsters_items;
};
