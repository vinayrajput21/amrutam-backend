const { User, Profile } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class UserService {
  async getProfile(userId) {
    const profile = await Profile.findOne({
      where: { userId },
      include: [{ model: User, attributes: ['email', 'role'] }],
    });

    if (!profile) {
      throw Object.assign(new Error('Profile not found'), { status: 404 });
    }

    return profile;
  }

  async updateProfile(userId, data) {
    const profile = await Profile.findOne({ where: { userId } });

    if (!profile) {
      throw Object.assign(new Error('Profile not found'), { status: 404 });
    }

    await profile.update(data);
    await profile.reload({ include: [{ model: User, attributes: ['email', 'role'] }] });

    return profile;
  }

  async assignRole(userId, role) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw Object.assign(new Error('User not found'), { status: 404 });
    }

    if (!['user', 'doctor', 'admin'].includes(role)) {
      throw Object.assign(new Error('Invalid role'), { status: 400 });
    }

    await user.update({ role });

    // If assigning doctor role → create Doctor record if missing
    if (role === 'doctor') {
      await require('../models/doctor').findOrCreate({
        where: { userId },
        defaults: { userId, specialty: 'General' }, // placeholder → should come from admin input
      });
    }

    return user;
  }

  // Optional: soft delete, deactivate, etc.
}

module.exports = UserService;