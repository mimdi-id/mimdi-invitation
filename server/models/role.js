'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // --- TAMBAHKAN INI ---
      // Mendefinisikan bahwa Role memiliki banyak (has many) User
      Role.hasMany(models.User, {
        foreignKey: 'roleId',
        as: 'users'
      });
    }
  }
  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};

