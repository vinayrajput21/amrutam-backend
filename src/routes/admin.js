const express = require('express');
const router = express.Router();

const {
  getDailyConsultations,
  getUserAnalytics,
  getDoctorPerformance,
} = require('../controllers/adminController');

const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');

/**
 * @swagger
 * /admin/analytics/consultations:
 *   get:
 *     summary: Get daily consultation statistics (Admin only)
 *     tags: [Admin, Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Daily stats
 */
router.get('/analytics/consultations', auth, rbac(['admin']), getDailyConsultations);

/**
 * @swagger
 * /admin/analytics/users:
 *   get:
 *     summary: Get user-related analytics (Admin only)
 *     tags: [Admin, Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User analytics
 */
router.get('/analytics/users', auth, rbac(['admin']), getUserAnalytics);

/**
 * @swagger
 * /admin/analytics/doctors/{doctorId}:
 *   get:
 *     summary: Get performance metrics for a doctor (Admin only)
 *     tags: [Admin, Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Doctor performance data
 */
router.get('/analytics/doctors/:doctorId', auth, rbac(['admin']), getDoctorPerformance);

module.exports = router;