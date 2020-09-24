// const mongoose = require("mongoose");
const keys = require("./config/keys");
import mongoose from "mongoose";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { MONGO_URI, MONGO_OPTIONS, REDIS_OPTIONS, APP_PORT } from "./config";

mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose
  .connect(MONGO_URI, MONGO_OPTIONS)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const RedisStore = connectRedis(session);

const client = new Redis(REDIS_OPTIONS);

export const store = new RedisStore({ client });

// const app = createApp(store);
module.exports = {
  mongoose,
  connect: () => {
    mongoose.Promise = Promise;
    mongoose
      .connect(MONGO_URI, MONGO_OPTIONS)
      .then(() => console.log("MongoDB Connected"))
      .catch(err => console.log(err));
  },
  disconnect: done => {
    mongoose.disconnect(done);
  }
};
