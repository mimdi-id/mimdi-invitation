'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mempelai extends Model {
    static associate(models) { /* ... asosiasi ... */ }
  }
  Mempelai.init({
    // ... kolom lain ...
    social_media_urls: {
      type: DataTypes.JSON,
      get() {
        const rawValue = this.getDataValue('social_media_urls');
        try { return typeof rawValue === 'string' ? JSON.parse(rawValue || '{}') : (rawValue || {}); } 
        catch (e) { return {}; }
      },
      set(value) { this.setDataValue('social_media_urls', JSON.stringify(value || {})); }
    },
    gift_info: {
      type: DataTypes.JSON,
      get() {
        const rawValue = this.getDataValue('gift_info');
        try { return typeof rawValue === 'string' ? JSON.parse(rawValue || '{}') : (rawValue || {}); }
        catch (e) { return {}; }
      },
      set(value) { this.setDataValue('gift_info', JSON.stringify(value || {})); }
    }
  }, { sequelize, modelName: 'Mempelai' });
  return Mempelai;
};

