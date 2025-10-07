'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Mempelai extends Model {
    /**
     * Mendefinisikan hubungan antar model.
     * Akan dipanggil secara otomatis oleh file `models/index.js`.
     */
    static associate(models) {
      // Hubungan: Satu entri data Mempelai dimiliki oleh satu Undangan.
      Mempelai.belongsTo(models.Invitation, { foreignKey: 'invitationId' });
    }
  }
  Mempelai.init({
    // Kolom untuk membedakan mempelai Pria atau Wanita.
    type: {
      type: DataTypes.ENUM('Pria', 'Wanita'),
      allowNull: false
    },
    // Kolom-kolom sesuai perencanaan awal Anda
    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    initials: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    child_order: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parents_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Kolom JSON untuk data yang lebih kompleks
    // Getter & Setter ditambahkan untuk memastikan data selalu konsisten (objek JavaScript)
    social_media_urls: {
      type: DataTypes.JSON,
      get() {
        const rawValue = this.getDataValue('social_media_urls');
        try {
          // Jika data dari DB adalah string, parse menjadi objek. Jika tidak, kembalikan apa adanya.
          return typeof rawValue === 'string' ? JSON.parse(rawValue || '{}') : (rawValue || {});
        } catch (e) {
          // Jika parsing gagal, kembalikan objek kosong untuk mencegah crash.
          return {};
        }
      },
      set(value) {
        // Selalu simpan data sebagai string JSON ke database.
        this.setDataValue('social_media_urls', JSON.stringify(value || {}));
      }
    },
    gift_info: {
      type: DataTypes.JSON,
      get() {
        const rawValue = this.getDataValue('gift_info');
        try {
          return typeof rawValue === 'string' ? JSON.parse(rawValue || '{}') : (rawValue || {});
        } catch (e) {
          return {};
        }
      },
      set(value) {
        this.setDataValue('gift_info', JSON.stringify(value || {}));
      }
    }
  }, {
    sequelize,
    modelName: 'Mempelai',
  });
  return Mempelai;
};

