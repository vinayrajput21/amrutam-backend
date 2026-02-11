const express = require('express');
const router = express.Router();

const { setAvailability, getAvailability, searchDoctors } = require('../controllers/doctorController');
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const validation = require('../middlewares/validation');
const doctorSchemas = require('../schemas/doctorSchemas'); // Assume Joi schemas

/**
 * @swagger
 * /doctors/availability:
 *   post:
 *     summary: Set availability slots (Doctor only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     startTime: { type: string, format: date-time }
 *                     endTime: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Availability slots created
 */
router.post(
  '/availability',
  auth,
  rbac(['doctor']),
  validation(doctorSchemas.setAvailability),
  setAvailability
);

/**
 * @swagger
 * /doctors/{doctorId}/availability:
 *   get:
 *     summary: Get doctor's available slots
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of availability slots
 */
router.get('/:doctorId/availability', getAvailability);

/**
 * @swagger
 * /doctors/search:
 *   get:
 *     summary: Search doctors with filters
 *     tags: [Doctors]
 *     parameters:
 *       - in: query
 *         name: specialty
 *         schema: { type: string }
 *       - in: query
 *         name: location
 *         schema: { type: string }
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of matching doctors
 */
router.get('/search', searchDoctors);

module.exports = router;