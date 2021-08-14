const Queue = require('bull');

/**
 * Factory for creating bull queues
 */
function createQueue(name, redisUrl) {
  return new Queue(name, redisUrl);
}

module.exports = {
  createQueue,
};