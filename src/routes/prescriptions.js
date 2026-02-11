const express = require('express');
const router = express.Router();

const {
  createPrescription,
  getPrescription,
  updatePrescription,
} = require('../controllers/prescriptionController');

const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const validation = require('../middlewares/validation');
const prescriptionSchemas = require('../schemas/prescriptionSchemas');

/**
 * @swagger
 * /prescriptions:
 *   post:
 *     summary: Create prescription (Doctor only)
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [consultationId, details]
 *             properties:
 *               consultationId: { type: string, format: uuid }
 *               details: { type: string }
 *     responses:
 *       201:
 *         description: Prescription created
 */
router.post(
  '/',
  auth,
  rbac(['doctor']),
  validation(prescriptionSchemas.create),
  createPrescription
);

/**
 * @swagger
 * /prescriptions/{prescriptionId}:
 *   get:
 *     summary: Get a prescription
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prescriptionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Prescription details
 */
router.get('/:prescriptionId', auth, getPrescription);

/**
 * @swagger
 * /prescriptions/{prescriptionId}:
 *   put:
 *     summary: Update prescription (Doctor only)
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prescriptionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               details: { type: string }
 *     responses:
 *       200:
 *         description: Updated prescription
 */
router.put(
  '/:prescriptionId',
  auth,
  rbac(['doctor']),
  validation(prescriptionSchemas.update),
  updatePrescription
);

module.exports = router;