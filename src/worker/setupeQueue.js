const { logger } = require('../common/logger');
const { createQueue } = require('../common/queueFactory');

function setupQueue(name, redisUrl, processFunction){
  logger.info(`[setup] - setting up ${name} queue`);
  const queue = createQueue(name, redisUrl);

  logger.info(`[setup] - setting up ${name} queue process`);
  queue.process(processFunction);

  logger.info(`[setup] - setup ${name} finished`);

  return queue;
}

module.exports = {
  setupQueue
};
