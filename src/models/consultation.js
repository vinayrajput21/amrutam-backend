const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Consultation = sequelize.define('Consultation', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  doctorId: { type: DataTypes.UUID, allowNull: false },
  slotId: { type: DataTypes.UUID, allowNull: false },
  status: { type: DataTypes.ENUM('scheduled', 'ongoing', 'completed', 'cancelled'), defaultValue: 'scheduled' },
  notes: { type: DataTypes.TEXT },
  idempotencyKey: { type: DataTypes.STRING, unique: true }, // For idempotent bookings
}, {
  timestamps: true,
});

module.exports = Consultation;