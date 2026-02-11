const { v4: uuidv4 } = require('uuid');
const BullMQ = require('bullmq');
const Consultation = require('../models/consultation');
const AvailabilitySlot = require('../models/availabilitySlot');
const jobQueue = new BullMQ.Queue('async-jobs', { connection: require('../config/redis') });

class BookingService {
  async bookSlot(userId, doctorId, slotId, idempotencyKey = uuidv4()) {
    // Check idempotency
    const existing = await Consultation.findOne({ where: { idempotencyKey } });
    if (existing) return existing; // Already processed

    const slot = await AvailabilitySlot.findByPk(slotId);
    if (!slot || slot.booked) throw new Error('Slot unavailable');

    await sequelize.transaction(async (t) => {
      const consultation = await Consultation.create({
        userId, doctorId, slotId, idempotencyKey,
      }, { transaction: t });
      slot.booked = true;
      await slot.save({ transaction: t });
    });

    // Async job for notification/prescription prep
    await jobQueue.add('sendBookingConfirmation', { consultationId: consultation.id });

    return consultation;
  }
}

module.exports = BookingService;