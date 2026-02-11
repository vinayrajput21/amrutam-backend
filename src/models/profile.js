const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Profile = sequelize.define('Profile', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false, unique: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  dateOfBirth: { type: DataTypes.DATE },
  gender: { type: DataTypes.ENUM('male', 'female', 'other') },
  // For doctors: additional fields if role is doctor, but handled in Doctor model
}, {
  timestamps: true,
});

module.exports = Profile;