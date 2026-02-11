const sequelize = require('./db');
const { client: redisClient, connect: connectRedis } = require('./redis');
const envConfig = require('./env');

module.exports = {
  sequelize,
  redisClient,
  connectRedis,
  config: envConfig,
};