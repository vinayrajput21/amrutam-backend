const AuditService = require('../services/auditService');

const getAuditLogs = async (req, res, next) => {
  try {
    // Admin only
    const { userId, actionType, fromDate, toDate } = req.query; // Filters
    const logs = await new AuditService().getAuditLogs({ userId, actionType, fromDate, toDate });
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAuditLogs };