const AnalyticsService = require('../services/analyticsService');

const getDailyConsultations = async (req, res, next) => {
  try {
    // Admin only
    const { date } = req.query; // Optional date filter
    const stats = await new AnalyticsService().getDailyConsultations(date);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

const getUserAnalytics = async (req, res, next) => {
  try {
    const analytics = await new AnalyticsService().getUserAnalytics();
    res.json(analytics);
  } catch (err) {
    next(err);
  }
};

const getDoctorPerformance = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const performance = await new AnalyticsService().getDoctorPerformance(doctorId);
    res.json(performance);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDailyConsultations, getUserAnalytics, getDoctorPerformance };