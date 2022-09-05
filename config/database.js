require('dotenv').config({path:__dirname+'./.env'})
module.exports = {
  secret:process.env.SESSION_SECRET || 'nodeauthsecret',
  schemaVersion: 2111, 
  database: `mongodb+srv://${process.env.MONGO_USERNAME}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`||`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}` ||'mongodb://localhost:27017/web-push',
  databaselogs: process.env.WRITE_LOG_MT_TO_REDISDB == 'false' ? `mongodb+srv://${process.env.MONGO_USERNAME}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_LOGDB}`||`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_LOGDB}` || 'mongodb://localhost:27017/web-push-log' : `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DATABASE}` || `redis://${process.env.REDIS_USERNAME}:${encodeURIComponent(process.env.REDIS_PASSWORD)}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DATABASE}` || 'redis://localhost:6379/rollout-logs',
  databasetest: `mongodb+srv://${process.env.MONGO_USERNAME}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_TESTDB}`||`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_TESTDB}` || 'mongodb://localhost:27017/rollout-test'
};
