'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GalleryPhoto extends Model {
    static associate(models) {
      GalleryPhoto.belongsTo(models.Invitation, { foreignKey: 'invitationId' });
    }
  }
  GalleryPhoto.init({
    image_url: DataTypes.STRING, caption: DataTypes.STRING, upload_order: DataTypes.INTEGER,
  }, { sequelize, modelName: 'GalleryPhoto' });
  return GalleryPhoto;
};

