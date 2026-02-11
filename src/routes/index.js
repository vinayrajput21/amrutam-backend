const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const doctorRoutes = require('./doctors');
const bookingRoutes = require('./bookings');
const prescriptionRoutes = require('./prescriptions');
const adminRoutes = require('./admin');

// Mount all route groups
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/doctors', doctorRoutes);
router.use('/bookings', bookingRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/admin', adminRoutes);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

module.exports = router;