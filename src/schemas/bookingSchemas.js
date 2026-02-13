const Joi = require('joi');

const createBooking = Joi.object({
  doctorId: Joi.string().uuid().required(),
  userId: Joi.string().uuid().required(),
  slotId: Joi.string().uuid().required(),
  consultationType: Joi.string().valid('ONLINE', 'OFFLINE').required()
});

module.exports = {
  createBooking
};
