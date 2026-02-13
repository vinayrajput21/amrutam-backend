const app = require('./app');
const { sequelize } = require('./models');
const redisClient = require('./config/redis');
const logger = require('./utils/logger');
const { startMetricsServer } = require('./utils/metrics');
const { setupTracing } = require('./utils/tracer');

async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');
    await redisClient.connect();
    logger.info('Redis connected');
    setupTracing();
    startMetricsServer(); 

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (err) {
    logger.error('Startup error:', err);
    process.exit(1);
  }
}

startServer();