const CONFIG = {
  RAW_FILE_LOCATION: `${process.cwd()}/tmp`,
  PERMANENT_LOCATION: `${process.cwd()}/images`,
  IMAGE_QUEUE: 'IMAGE_QUEUE',
  REDIS_URL: process.env.REDIS_URL,
};

module.exports = {
  CONFIG,
};