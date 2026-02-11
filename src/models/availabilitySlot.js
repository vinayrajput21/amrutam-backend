const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AvailabilitySlot = sequelize.define('AvailabilitySlot', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  doctorId: { type: DataTypes.UUID, allowNull: false },
  startTime: { type: DataTypes.DATE, allowNull: false },
  endTime: { type: DataTypes.DATE, allowNull: false },
  booked: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  timestamps: true,
  indexes: [
    { fields: ['doctorId', 'startTime'], unique: true }, // Prevent overlapping slots if needed
  ],
});

module.exports = AvailabilitySlot;