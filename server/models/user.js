'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // --- TAMBAHKAN INI ---
      // Mendefinisikan bahwa User memiliki (belongs to) satu Role
      User.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'role', // Ini harus cocok dengan 'as' di controller
      });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles', // Nama tabel
        key: 'id'
      }
    },
    invitation_quota: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};

