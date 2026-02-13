const Joi = require('joi');

const createDoctor = Joi.object({
  name: Joi.string().required(),
  specialty: Joi.string().required(),
  experience: Joi.number().integer().min(0).required()
});

module.exports = {
  createDoctor
};
