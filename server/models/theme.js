'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Theme extends Model {
    /**
     * Mendefinisikan hubungan antar model.
     */
    static associate(models) {
      // Hubungan: Satu Tema bisa digunakan oleh banyak Undangan.
      Theme.hasMany(models.Invitation, { foreignKey: 'themeId' });
    }
  }
  Theme.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tier: {
      type: DataTypes.ENUM('Basic', 'Premium', 'Custom'),
      allowNull: false
    },
    // --- KOLOM BARU YANG PENTING ---
    // Menyimpan nama komponen React yang akan digunakan untuk tema ini.
    // Contoh: 'ElegantTheme', 'RusticTheme'
    component_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // ----------------------------
    config: {
      type: DataTypes.JSON,
      get() {
        const rawValue = this.getDataValue('config');
        try {
          return typeof rawValue === 'string' ? JSON.parse(rawValue || '{}') : (rawValue || {});
        } catch (e) {
          return {};
        }
      },
      set(value) {
        this.setDataValue('config', JSON.stringify(value || {}));
      }
    }
  }, {
    sequelize,
    modelName: 'Theme',
  });
  return Theme;
};

