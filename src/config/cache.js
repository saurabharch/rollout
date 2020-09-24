import { RedisOptions } from "ioredis";

const {
  REDIS_PORT = 17102,
  REDIS_HOST = "redis-17102.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  REDIS_PASSWORD = "o2VTQjWB1oLh3Q2Rq0slCT0zTV8ATkKm"
} = process.env;

export const REDIS_OPTIONS = {
  port: +REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD
};
