const { AuditLog } = require('../models');
const { Op } = require('sequelize');

class AuditService {
  async logAction(userId, action, entity = null, entityId = null, details = {}, ip = null) {
    await AuditLog.create({
      userId,
      action,
      entity,
      entityId,
      details,
      ipAddress: ip || 'unknown',
    });
  }

  async getAuditLogs(filters = {}) {
    const { userId, actionType, fromDate, toDate } = filters;

    const where = {};

    if (userId) where.userId = userId;
    if (actionType) where.action = actionType;
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt[Op.gte] = new Date(fromDate);
      if (toDate) where.createdAt[Op.lte] = new Date(toDate);
    }

    return await AuditLog.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 100, // safety limit
    });
  }
}

module.exports = AuditService;