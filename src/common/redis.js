const url = require('url');
require('dotenv').config({path:__dirname+'./config/.env'})
const Redis = require('ioredis');
const { CONFIG } = require('./config');
const { logger } = require('./logger');

/**
 *
 */
function getRedisConfig(redisUrl) {
  const redisConfig = url.parse(redisUrl);

  return {
    host: process.env.REDIS_HOST || redisConfig.hostname,
    port: process.env.REDIST_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    database: process.env.REDIS_DATABASE || '',
  };
}

let redisInstance = undefined;
/**
 *
 */
async function getRedisConnectionInstance() {
  try {
    if (!redisInstance) {
      const config = getRedisConfig(CONFIG.REDIS_URL);

      redisInstance = await new Redis({
        port: config.port,
        host: config.host,
        password: config.password,
        db: config.database,
      });
    }
  } catch (e) {
    logger.error('Failed to connect to redis', e);
  }

  return redisInstance;
}

module.exports = {
  getRedisConfig,
  getRedisConnectionInstance,
};