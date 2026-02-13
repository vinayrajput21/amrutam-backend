const Joi = require('joi');

const createPrescription = Joi.object({
  consultationId: Joi.string().uuid().required(),
  medicines: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      dosage: Joi.string().required(),
      duration: Joi.string().required()
    })
  ).required()
});

module.exports = {
  createPrescription
};
