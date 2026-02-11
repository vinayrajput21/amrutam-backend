const express = require('express');
const router = express.Router();

const { bookSlot, getConsultations, cancelBooking } = require('../controllers/bookingController');
const auth = require('../middlewares/auth');
const validation = require('../middlewares/validation');
const bookingSchemas = require('../schemas/bookingSchemas');

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Book a consultation slot
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctorId, slotId]
 *             properties:
 *               doctorId: { type: string, format: uuid }
 *               slotId: { type: string, format: uuid }
 *     headers:
 *       Idempotency-Key:
 *         description: Idempotency key to prevent duplicate bookings
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Consultation booked
 */
router.post(
  '/',
  auth,
  validation(bookingSchemas.bookSlot),
  bookSlot
);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get user's or doctor's consultations
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of consultations
 */
router.get('/', auth, getConsultations);

/**
 * @swagger
 * /bookings/{consultationId}:
 *   delete:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consultationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Booking cancelled
 */
router.delete('/:consultationId', auth, cancelBooking);

module.exports = router;