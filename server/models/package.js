'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    static associate(models) {
      Package.hasMany(models.Invitation, { foreignKey: 'packageId' });
      Package.hasMany(models.Order, { foreignKey: 'packageId' });
    }
  }
  Package.init({
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    active_period_months: { type: DataTypes.INTEGER, allowNull: false },
    photo_limit: { type: DataTypes.INTEGER, allowNull: false },
    revisions_limit: { type: DataTypes.INTEGER, allowNull: false },
    features: {
      type: DataTypes.JSON,
      get() {
        const rawValue = this.getDataValue('features');
        try { return typeof rawValue === 'string' ? JSON.parse(rawValue || '[]') : (rawValue || []); } catch (e) { return []; }
      },
      set(value) { this.setDataValue('features', JSON.stringify(value || [])); }
    }
  }, { sequelize, modelName: 'Package' });
  return Package;
};

