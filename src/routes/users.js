const express = require('express');
const router = express.Router();

const { getProfile, updateProfile, assignRole } = require('../controllers/userController');
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const validation = require('../middlewares/validation');
const userSchemas = require('../schemas/userSchemas'); // Assume Joi schemas exist

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
router.get('/profile', auth, getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *     responses:
 *       200:
 *         description: Updated profile
 */
router.put('/profile', auth, validation(userSchemas.updateProfile), updateProfile);

/**
 * @swagger
 * /users/assign-role:
 *   post:
 *     summary: Assign role to a user (Admin only)
 *     tags: [Users, Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, role]
 *             properties:
 *               userId: { type: string, format: uuid }
 *               role: { type: string, enum: [user, doctor, admin] }
 *     responses:
 *       200:
 *         description: User role updated
 */
router.post(
  '/assign-role',
  auth,
  rbac(['admin']),
  validation(userSchemas.assignRole),
  assignRole
);

module.exports = router;