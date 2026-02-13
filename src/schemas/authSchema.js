const Joi = require('joi');

const register = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('ADMIN', 'DOCTOR', 'PATIENT').optional()
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  register,
  login
};
