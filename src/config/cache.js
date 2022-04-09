
// const {
//   REDIS_PORT = 17102,
//   REDIS_HOST = "redis-17102.c212.ap-south-1-1.ec2.cloud.redislabs.com",
//   REDIS_PASSWORD = "o2VTQjWB1oLh3Q2Rq0slCT0zTV8ATkKm"
// } = process.env;
import { RedisMemoryServer } from 'redis-memory-server';
const redisServer = new RedisMemoryServer();

const host_redis = await redisServer.getHost();
const port_redis = await redisServer.getPort();
export const REDIS_OPTIONS = {
  // port: +REDIS_PORT,
  // host: REDIS_HOST,
  // password: REDIS_PASSWORD
  host: '127.0.0.1' ||host_redis,
  port: 6379 ||port_redis
  // password: 'o2VTQjWB1oLh3Q2Rq0slCT0zTV8ATkKm'
};
