/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201: { description: User created }
 */
const express = require('express');
const { register, login } = require('../controllers/authController');
const validation = require('../middlewares/validation');
const authSchema = require('../schemas/authSchema'); // Joi schema

const router = express.Router();
router.post('/register', validation(authSchema.register), register);
router.post('/login', validation(authSchema.login), login);

module.exports = router;