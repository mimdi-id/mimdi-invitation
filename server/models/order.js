'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Invitation, { as: 'invitation', foreignKey: 'invitationId' });
      Order.belongsTo(models.Package, { as: 'package', foreignKey: 'packageId' });
    }
  }
  Order.init({
    amount: DataTypes.DECIMAL,
    payment_status: DataTypes.ENUM('Tertunda', 'Dikonfirmasi', 'Gagal'),
    confirmed_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};

