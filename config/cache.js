require('dotenv').config({path:__dirname+'./.env'})
const {
  REDIS_PORT = process.env.REDIS_PORT,
  REDIS_HOST = process.env.REDIS_HOST,
  REDIS_DB = process.env.REDIS_DATABASE,
  REDIS_PASSWORD = process.env.REDIS_PASSWORD,
  REDIS_LINK = process.env.REDIS_URL,
} = process.env;
// import { RedisMemoryServer } from 'redis-memory-server';

// const redisServer = new RedisMemoryServer();

// const host = await redisServer.getHost();
// const port = await redisServer.getPort();
// console.log(`${redisServer.getInstanceInfo()}`)
export const REDIS_OPTIONS = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  database: process.env.REDIS_DB,
  password: process.env.REDIS_PASSWORD,
  url: process.env.REDIS_LINK
  // host: '127.0.0.1' ||host_redis,
  // port: 6379 ||port_redis
  // password: 'o2VTQjWB1oLh3Q2Rq0slCT0zTV8ATkKm'
};