const { getRedisConnectionInstance } = require('../common/redis');
const { IMAGE_STATES } = require('../common/constants');
const { resizeAndSaveImage } = require('../common/services/imageService');
const { logger } = require('../common/logger');

async function processQueuedItem(job, data){
  logger.info(`[processQueuedItem] begin processing ${job.id}`);
  const redisInstance = await getRedisConnectionInstance();
  const fileData = job.data;

  try{
    // resize image, update state, update file data in redis
    await resizeAndSaveImage(fileData);
    fileData.state = IMAGE_STATES.RESIZED;
    redisInstance.set(fileData.id, JSON.stringify(fileData));

    logger.info(`[processQueuedItem] finish processing ${job.id}`);
  }catch(e){
    logger.error(`[processQueuedItem] error processing ${job.id}`, e);
    fileData.state = IMAGE_STATES.ERRORED;
    redisInstance.set(fileData.id, JSON.stringify(fileData));
  }
}

module.exports = {
  processQueuedItem
};
