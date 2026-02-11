const PrescriptionService = require('../services/prescriptionService');

const createPrescription = async (req, res, next) => {
  try {
    // Doctor only, for a consultation
    const { consultationId, details } = req.body;
    const prescription = await new PrescriptionService().createPrescription(consultationId, req.user.id, details);
    res.status(201).json(prescription);
  } catch (err) {
    next(err);
  }
};

const getPrescription = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;
    const prescription = await new PrescriptionService().getPrescription(prescriptionId, req.user.id, req.user.role);
    res.json(prescription);
  } catch (err) {
    next(err);
  }
};

const updatePrescription = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;
    const updated = await new PrescriptionService().updatePrescription(prescriptionId, req.user.id, req.body.details);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = { createPrescription, getPrescription, updatePrescription };