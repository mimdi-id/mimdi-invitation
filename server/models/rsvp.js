'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RSVP extends Model {
    /**
     * Mendefinisikan hubungan antar model.
     */
    static associate(models) {
      // Hubungan: Satu entri RSVP dimiliki oleh satu Undangan.
      RSVP.belongsTo(models.Invitation, { foreignKey: 'invitationId' });
    }
  }
  RSVP.init({
    guest_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attendance_status: {
      type: DataTypes.ENUM('Hadir', 'Ragu-ragu', 'Tidak Hadir'),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true, // Ucapan bersifat opsional
    }
  }, {
    sequelize,
    modelName: 'RSVP',
  });
  return RSVP;
};
