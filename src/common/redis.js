const url = require('url');
const Redis = require('ioredis');
const { CONFIG } = require('./config');
const { logger } = require('./logger');

/**
 *
 */
function getRedisConfig(redisUrl) {
  const redisConfig = url.parse(redisUrl);

  return {
    host: redisConfig.hostname,
    port: Number(redisConfig.port) || 6379,
    database: 0,
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