const { Prescription, Consultation, Doctor, User } = require('../models');
const cryptoUtil = require('../utils/cryptoUtil');
const logger = require('../utils/logger');

class PrescriptionService {
  async createPrescription(consultationId, doctorUserId, details) {
    const consultation = await Consultation.findByPk(consultationId, {
      include: [{ model: Doctor }],
    });

    if (!consultation) {
      throw Object.assign(new Error('Consultation not found'), { status: 404 });
    }

    if (consultation.Doctor.userId !== doctorUserId) {
      throw Object.assign(new Error('Not authorized to prescribe for this consultation'), { status: 403 });
    }

    if (consultation.status !== 'ongoing' && consultation.status !== 'completed') {
      throw Object.assign(new Error('Consultation must be ongoing or completed'), { status: 400 });
    }

    const encryptedDetails = cryptoUtil.encrypt(details);

    const prescription = await Prescription.create({
      consultationId,
      details: encryptedDetails,
    });

    // Optional: trigger async job to notify patient
    const jobQueue = require('./jobQueue');
    await jobQueue.add('notifyPrescription', { prescriptionId: prescription.id });

    return prescription;
  }

  async getPrescription(prescriptionId, userId, role) {
    const prescription = await Prescription.findByPk(prescriptionId, {
      include: [
        {
          model: Consultation,
          include: [
            { model: User, as: 'Patient', attributes: ['id'] },
            { model: Doctor, include: [{ model: User, attributes: ['id'] }] },
          ],
        },
      ],
    });

    if (!prescription) {
      throw Object.assign(new Error('Prescription not found'), { status: 404 });
    }

    const isPatient = prescription.Consultation.Patient.id === userId;
    const isDoctor = prescription.Consultation.Doctor.User.id === userId;

    if (role === 'admin' || isPatient || isDoctor) {
      prescription.details = cryptoUtil.decrypt(prescription.details);
      return prescription;
    }

    throw Object.assign(new Error('Unauthorized'), { status: 403 });
  }

  async updatePrescription(prescriptionId, doctorUserId, newDetails) {
    const prescription = await Prescription.findByPk(prescriptionId, {
      include: [{ model: Consultation, include: [{ model: Doctor }] }],
    });

    if (!prescription) {
      throw Object.assign(new Error('Prescription not found'), { status: 404 });
    }

    if (prescription.Consultation.Doctor.userId !== doctorUserId) {
      throw Object.assign(new Error('Not authorized'), { status: 403 });
    }

    prescription.details = cryptoUtil.encrypt(newDetails);
    await prescription.save();

    return prescription;
  }
}

module.exports = PrescriptionService;