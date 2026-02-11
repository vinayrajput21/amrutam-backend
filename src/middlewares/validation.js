const Joi = require('joi');

// Middleware to validate request body against a Joi schema
// Usage: validation(schema) where schema is a Joi object
module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorDetails = error.details.map((detail) => detail.message);
    return res.status(400).json({ msg: 'Validation error', details: errorDetails });
  }

  next();
};