const { createClient } = require('redis');
const config = require('./env');
const logger = require('../utils/logger');

const redisClient = createClient({
  url: config.redis.url,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        return new Error('Max retries reached – giving up on Redis connection');
      }
      return Math.min(retries * 100, 3000); // exponential backoff
    },
  },
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));
redisClient.on('reconnecting', () => logger.warn('Redis Client is reconnecting...'));
redisClient.on('ready', () => logger.info('Redis Client Ready'));

// Connect lazily – will be called in server.js
async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
}

// Export both client and connect function
module.exports = {
  client: redisClient,
  connect: connectRedis,
};