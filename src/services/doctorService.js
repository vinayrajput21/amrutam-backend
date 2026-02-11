const { Doctor, AvailabilitySlot, User, Profile } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class DoctorService {
  async setAvailability(doctorUserId, slots) {
    const doctor = await Doctor.findOne({ where: { userId: doctorUserId } });

    if (!doctor) {
      throw Object.assign(new Error('Doctor profile not found'), { status: 404 });
    }

    const createdSlots = [];

    for (const slot of slots) {
      const { startTime, endTime } = slot;

      if (new Date(startTime) >= new Date(endTime)) {
        throw Object.assign(new Error('Invalid time range'), { status: 400 });
      }

      // Basic overlap check (can be improved with more sophisticated logic)
      const overlapping = await AvailabilitySlot.findOne({
        where: {
          doctorId: doctor.id,
          [Op.or]: [
            {
              startTime: { [Op.lt]: endTime },
              endTime: { [Op.gt]: startTime },
            },
          ],
        },
      });

      if (overlapping) {
        throw Object.assign(new Error('Time slot overlaps with existing availability'), { status: 409 });
      }

      const newSlot = await AvailabilitySlot.create({
        doctorId: doctor.id,
        startTime,
        endTime,
        booked: false,
      });

      createdSlots.push(newSlot);
    }

    return createdSlots;
  }

  async getAvailability(doctorId) {
    const slots = await AvailabilitySlot.findAll({
      where: {
        doctorId,
        booked: false,
        startTime: { [Op.gt]: new Date() }, // future only
      },
      order: [['startTime', 'ASC']],
    });

    return slots;
  }

  async searchDoctors(filters = {}) {
    const { specialty, location, name } = filters;

    const where = {};
    if (specialty) where.specialty = { [Op.iLike]: `%${specialty}%` };
    if (location) where.location = { [Op.iLike]: `%${location}%` };

    const doctors = await Doctor.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id'],
          required: true,
          include: [
            {
              model: Profile,
              attributes: ['fullName'],
              where: name ? { fullName: { [Op.iLike]: `%${name}%` } } : {},
              required: !!name,
            },
          ],
        },
      ],
      order: [['rating', 'DESC']],
    });

    return doctors;
  }
}

module.exports = DoctorService;