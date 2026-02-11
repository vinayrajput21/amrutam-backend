const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Doctor = sequelize.define('Doctor', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false, unique: true },
  specialty: { type: DataTypes.STRING, allowNull: false },
  licenseNumber: { type: DataTypes.STRING, unique: true },
  yearsOfExperience: { type: DataTypes.INTEGER },
  location: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
  rating: { type: DataTypes.FLOAT, defaultValue: 0.0 },
}, {
  timestamps: true,
});

module.exports = Doctor;