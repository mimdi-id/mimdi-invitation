'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invitation extends Model {
    static associate(models) {
      // Asosiasi
      Invitation.belongsTo(models.User, { as: 'admin', foreignKey: 'adminId' });
      Invitation.belongsTo(models.User, { as: 'client', foreignKey: 'userId' });
      Invitation.belongsTo(models.Package, { as: 'package', foreignKey: 'packageId' });
      Invitation.belongsTo(models.Theme, { as: 'theme', foreignKey: 'themeId' });
      Invitation.hasOne(models.Order, { as: 'order', foreignKey: 'invitationId' });
      Invitation.hasMany(models.Mempelai, { as: 'mempelai', foreignKey: 'invitationId', onDelete: 'CASCADE' });
      Invitation.hasMany(models.Event, { as: 'events', foreignKey: 'invitationId', onDelete: 'CASCADE' });
      Invitation.hasMany(models.GalleryPhoto, { as: 'galleryPhotos', foreignKey: 'invitationId', onDelete: 'CASCADE' });
      Invitation.hasMany(models.LoveStory, { as: 'loveStories', foreignKey: 'invitationId', onDelete: 'CASCADE' });
    }
  }
  Invitation.init({
    title: DataTypes.STRING,
    slug: { type: DataTypes.STRING, unique: true },
    status: DataTypes.ENUM('Draf', 'Aktif', 'Kedaluwarsa'),
    activation_date: DataTypes.DATE,
    expiry_date: DataTypes.DATE,
    cover_image_url: DataTypes.STRING,
    hero_image_url: DataTypes.STRING,
    footer_image_url: DataTypes.STRING,
    music_url: DataTypes.STRING,
    video_url: DataTypes.STRING,
    live_stream_url: DataTypes.STRING,
    doa_quotes: DataTypes.TEXT,
    client_pin_plain: DataTypes.STRING,
    // Perbaikan Getter/Setter untuk JSON
    show_features: {
      type: DataTypes.JSON,
      get() {
        const rawValue = this.getDataValue('show_features');
        try { return typeof rawValue === 'string' ? JSON.parse(rawValue || '{}') : (rawValue || {}); } catch (e) { return {}; }
      },
      set(value) { this.setDataValue('show_features', JSON.stringify(value || {})); }
    }
  }, { sequelize, modelName: 'Invitation' });
  return Invitation;
};

