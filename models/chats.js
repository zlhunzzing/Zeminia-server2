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
    {
      // 이모지도 저장할 수 있게 설정하기.
      timestamps: true,
      // paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  );
  chats.associate = function(models) {
    // associations can be defined here
    models.chats.belongsTo(models.characters, {
      foreignKey: 'character_id'
    });
  };
  return chats;
};
