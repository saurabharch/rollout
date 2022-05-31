
const {
  REDIS_PORT = process.env.REDIS_PORT,
  REDIS_HOST = process.env.REDIS_HOST,
  REDIS_PASSWORD = process.env._REDIS_PASSWORD
} = process.env;
// import { RedisMemoryServer } from 'redis-memory-server';

// const redisServer = new RedisMemoryServer();

// const host = await redisServer.getHost();
// const port = await redisServer.getPort();
// console.log(`${redisServer.getInstanceInfo()}`)
export const REDIS_OPTIONS = {
  port: REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD
  // host: '127.0.0.1' ||host_redis,
  // port: 6379 ||port_redis
  // password: 'o2VTQjWB1oLh3Q2Rq0slCT0zTV8ATkKm'
};
