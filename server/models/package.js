'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Package.init({
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    active_period_months: DataTypes.INTEGER,
    photo_limit: DataTypes.INTEGER,
    revisions_limit: DataTypes.INTEGER,
    features: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Package',
  });
  return Package;
};