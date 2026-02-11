const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID },
  action: { type: DataTypes.STRING, allowNull: false }, // e.g., 'login', 'booking_created'
  entity: { type: DataTypes.STRING }, // e.g., 'Consultation'
  entityId: { type: DataTypes.UUID },
  details: { type: DataTypes.JSON }, // Additional data
  ipAddress: { type: DataTypes.STRING },
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['action'] },
    { fields: ['createdAt'] },
  ],
});

module.exports = AuditLog;