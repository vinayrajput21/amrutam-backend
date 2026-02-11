const sequelize = require('../config/db');
const User = require('./user');
const Profile = require('./profile');
const Doctor = require('./doctor');
const AvailabilitySlot = require('./availabilitySlot');
const Consultation = require('./consultation');
const Prescription = require('./prescription');
const Payment = require('./payment');
const AuditLog = require('./auditLog');

// Associations
User.hasOne(Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Doctor, { foreignKey: 'userId', onDelete: 'CASCADE' });
Doctor.belongsTo(User, { foreignKey: 'userId' });

Doctor.hasMany(AvailabilitySlot, { foreignKey: 'doctorId', onDelete: 'CASCADE' });
AvailabilitySlot.belongsTo(Doctor, { foreignKey: 'doctorId' });

User.hasMany(Consultation, { foreignKey: 'userId', as: 'PatientConsultations' });
Consultation.belongsTo(User, { foreignKey: 'userId', as: 'Patient' });

Doctor.hasMany(Consultation, { foreignKey: 'doctorId' });
Consultation.belongsTo(Doctor, { foreignKey: 'doctorId' });

AvailabilitySlot.hasOne(Consultation, { foreignKey: 'slotId', onDelete: 'SET NULL' });
Consultation.belongsTo(AvailabilitySlot, { foreignKey: 'slotId' });

Consultation.hasOne(Prescription, { foreignKey: 'consultationId', onDelete: 'CASCADE' });
Prescription.belongsTo(Consultation, { foreignKey: 'consultationId' });

Consultation.hasOne(Payment, { foreignKey: 'consultationId', onDelete: 'CASCADE' });
Payment.belongsTo(Consultation, { foreignKey: 'consultationId' });

User.hasMany(AuditLog, { foreignKey: 'userId' });
AuditLog.belongsTo(User, { foreignKey: 'userId' });

// Sync models (for development; use migrations in prod)
if (process.env.NODE_ENV !== 'production') {
  sequelize.sync();
}

module.exports = {
  sequelize,
  User,
  Profile,
  Doctor,
  AvailabilitySlot,
  Consultation,
  Prescription,
  Payment,
  AuditLog,
};