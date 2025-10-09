'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invitation extends Model {
    static associate(models) {
      Invitation.belongsTo(models.User, { as: 'admin', foreignKey: 'adminId' });
      // FIX: Mengubah foreignKey dari 'userId' menjadi 'clientId' agar sesuai
      Invitation.belongsTo(models.User, { as: 'client', foreignKey: 'clientId' }); 
      Invitation.belongsTo(models.Package, { as: 'package', foreignKey: 'packageId' });
      Invitation.belongsTo(models.Theme, { as: 'theme', foreignKey: 'themeId' });
      Invitation.hasOne(models.Order, { as: 'order', foreignKey: 'invitationId' });
      Invitation.hasMany(models.Mempelai, { as: 'mempelai', foreignKey: 'invitationId', onDelete: 'CASCADE' });
      Invitation.hasMany(models.Event, { as: 'events', foreignKey: 'invitationId', onDelete: 'CASCADE' });
      Invitation.hasMany(models.GalleryPhoto, { as: 'galleryPhotos', foreignKey: 'invitationId', onDelete: 'CASCADE' });
      Invitation.hasMany(models.LoveStory, { as: 'loveStories', foreignKey: 'invitationId', onDelete: 'CASCADE' });
      Invitation.hasMany(models.RSVP, { as: 'rsvps', foreignKey: 'invitationId', onDelete: 'CASCADE' });
    }
  }
  Invitation.init({
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    // FIX: Mengoreksi salah ketik dari 'Draf' menjadi 'Draft'
    status: { type: DataTypes.ENUM('Draft', 'Aktif', 'Kedaluwarsa'), defaultValue: 'Draft' },
    client_pin_plain: { type: DataTypes.STRING, allowNull: true },
    activation_date: DataTypes.DATE,
    expiry_date: DataTypes.DATE,
    cover_image_url: DataTypes.STRING,
    hero_image_url: DataTypes.STRING,
    footer_image_url: DataTypes.STRING,
    music_url: DataTypes.STRING,
    video_url: DataTypes.STRING,
    live_stream_url: DataTypes.STRING,
    turut_mengundang_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    doa_quotes: DataTypes.TEXT,
    show_features: {
      type: DataTypes.JSON,
      get() {
        const rawValue = this.getDataValue('show_features');
        try { return typeof rawValue === 'string' ? JSON.parse(rawValue || '{}') : (rawValue || {}); } catch (e) { return {}; }
      },
      set(value) { this.setDataValue('show_features', JSON.stringify(value || {})); }
    }
  }, {
    sequelize,
    modelName: 'Invitation',
  });
  return Invitation;
};
