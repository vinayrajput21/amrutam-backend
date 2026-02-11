const logger = require('../utils/logger');

// Global error handler
module.exports = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.url}`, { stack: err.stack });

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    msg: statusCode === 500 ? 'Internal Server Error' : err.message,
  });
};