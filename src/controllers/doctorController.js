const DoctorService = require('../services/doctorService');

const setAvailability = async (req, res, next) => {
  try {
    // Doctor only, checked by RBAC
    const slots = await new DoctorService().setAvailability(req.user.id, req.body.slots);
    res.status(201).json(slots);
  } catch (err) {
    next(err);
  }
};

const getAvailability = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const availability = await new DoctorService().getAvailability(doctorId);
    res.json(availability);
  } catch (err) {
    next(err);
  }
};

const searchDoctors = async (req, res, next) => {
  try {
    const { specialty, location, name } = req.query; // Filtering params
    const doctors = await new DoctorService().searchDoctors({ specialty, location, name });
    res.json(doctors);
  } catch (err) {
    next(err);
  }
};

module.exports = { setAvailability, getAvailability, searchDoctors };