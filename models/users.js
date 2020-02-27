'use strict';
var models = require('../models');
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    'users',
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {}
  );
  users.associate = function(models) {
    // associations can be defined here
    models.users.hasMany(models.characters, {
      foreignKey: 'user_id'
    });
  };
  return users;
};
