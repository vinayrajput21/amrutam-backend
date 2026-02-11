const { Sequelize } = require('sequelize');
const config = require('./env');
const logger = require('../utils/logger');

let sequelize;

if (config.database.url) {
  // Preferred: use connection string (DATABASE_URL)
  sequelize = new Sequelize(config.database.url, {
    dialect: 'postgres',
    logging: config.env === 'development' ? (msg) => logger.debug(msg) : false,
    dialectOptions: {
      ssl: config.env === 'production' ? {
        require: true,
        rejectUnauthorized: false, // depends on your hosting provider
      } : false,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // Fallback: individual credentials
  sequelize = new Sequelize(
    config.database.name,
    config.database.user,
    config.database.password,
    {
      host: config.database.host,
      port: config.database.port,
      dialect: 'postgres',
      logging: config.env === 'development' ? (msg) => logger.debug(msg) : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

// Test connection on startup (development only)
if (config.env !== 'production' && config.env !== 'test') {
  sequelize.authenticate()
    .then(() => logger.info('PostgreSQL connection has been established successfully.'))
    .catch((err) => {
      logger.error('Unable to connect to the database:', err);
      process.exit(1);
    });
}

module.exports = sequelize;