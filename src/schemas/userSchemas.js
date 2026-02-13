const Joi = require('joi');

const createUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('ADMIN', 'DOCTOR', 'PATIENT').required()
});

const updateUser = Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid('ADMIN', 'DOCTOR', 'PATIENT').optional()
});

module.exports = {
  createUser,
  updateUser
};
