'use strict';
const { Model } = require('sequelize');
// Kita tidak lagi butuh bcrypt di sini karena tidak ada enkripsi otomatis
// const bcrypt = require('bcryptjs'); 

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
      User.hasMany(models.Invitation, { foreignKey: 'adminId', as: 'createdInvitations' });
      User.hasMany(models.Invitation, { foreignKey: 'userId', as: 'ownedInvitations' });
    }
  }
  User.init({
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    invitation_quota: { type: DataTypes.INTEGER, defaultValue: 0 },
    password_pin: { type: DataTypes.STRING, allowNull: true },
  }, {
    sequelize,
    modelName: 'User',
    // --- BLOK HOOKS DIHAPUS SEPENUHNYA DARI SINI ---
  });
  return User;
};

