const BookingService = require('../services/bookingService');

const bookSlot = async (req, res, next) => {
  try {
    const { doctorId, slotId } = req.body;
    const consultation = await new BookingService().bookSlot(req.user.id, doctorId, slotId, req.headers['idempotency-key']);
    res.status(201).json(consultation);
  } catch (err) {
    next(err);
  }
};

const getConsultations = async (req, res, next) => {
  try {
    const consultations = await new BookingService().getConsultations(req.user.id, req.user.role); // User sees own, doctor sees assigned
    res.json(consultations);
  } catch (err) {
    next(err);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const { consultationId } = req.params;
    await new BookingService().cancelBooking(consultationId, req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { bookSlot, getConsultations, cancelBooking };