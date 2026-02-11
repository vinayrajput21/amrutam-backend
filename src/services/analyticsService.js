const { Consultation, User, Doctor, Prescription } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class AnalyticsService {
  async getDailyConsultations(dateStr) {
    const date = dateStr ? new Date(dateStr) : new Date();
    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const count = await Consultation.count({
      where: {
        createdAt: { [Op.between]: [date, nextDay] },
      },
    });

    const completed = await Consultation.count({
      where: {
        createdAt: { [Op.between]: [date, nextDay] },
        status: 'completed',
      },
    });

    return { date: date.toISOString().split('T')[0], total: count, completed };
  }

  async getUserAnalytics() {
    const totalUsers = await User.count();
    const totalPatients = await User.count({ where: { role: 'user' } });
    const totalDoctors = await User.count({ where: { role: 'doctor' } });

    const activeLast30 = await User.count({
      where: {
        updatedAt: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    });

    return { totalUsers, totalPatients, totalDoctors, activeLast30Days: activeLast30 };
  }

  async getDoctorPerformance(doctorId) {
    const consultations = await Consultation.count({ where: { doctorId } });
    const completed = await Consultation.count({
      where: { doctorId, status: 'completed' },
    });

    const prescriptions = await Prescription.count({
      include: [{ model: Consultation, where: { doctorId } }],
    });

    const avgRating = await Doctor.findByPk(doctorId, { attributes: ['rating'] });

    return {
      totalConsultations: consultations,
      completedConsultations: completed,
      prescriptionsIssued: prescriptions,
      averageRating: avgRating?.rating || 0,
    };
  }
}

module.exports = AnalyticsService;