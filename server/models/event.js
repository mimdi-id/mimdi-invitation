'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.Invitation, { foreignKey: 'invitationId' });
    }
  }
  Event.init({
    title: DataTypes.STRING, event_datetime: DataTypes.DATE,
    venue_name: DataTypes.STRING, address: DataTypes.TEXT,
    google_maps_url: DataTypes.STRING,
  }, { sequelize, modelName: 'Event' });
  return Event;
};

