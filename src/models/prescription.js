const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const cryptoUtil = require('../utils/cryptoUtil'); // For encrypting sensitive data

const Prescription = sequelize.define('Prescription', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  consultationId: { type: DataTypes.UUID, allowNull: false },
  details: { type: DataTypes.TEXT, allowNull: false }, // Encrypted medication details
  issuedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  timestamps: true,
  hooks: {
    beforeSave: async (prescription) => {
      if (prescription.changed('details')) {
        prescription.details = cryptoUtil.encrypt(prescription.details);
      }
    },
    afterFind: (prescription) => {
      if (prescription && prescription.details) {
        prescription.details = cryptoUtil.decrypt(prescription.details);
      }
    },
  },
});

module.exports = Prescription;