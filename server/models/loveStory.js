'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LoveStory extends Model {
    static associate(models) {
      LoveStory.belongsTo(models.Invitation, { foreignKey: 'invitationId' });
    }
  }
  LoveStory.init({
    title: DataTypes.STRING, story: DataTypes.TEXT, story_order: DataTypes.INTEGER,
  }, { sequelize, modelName: 'LoveStory' });
  return LoveStory;
};

