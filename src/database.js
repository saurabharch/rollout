// const mongoose = require("mongoose");
import mongoose from'mongoose';
import session from'express-session';
import connectRedis from'connect-redis';
import Redis from'ioredis';
const colors = require("colors");
import{ MONGO_URI, MONGO_OPTIONS, REDIS_OPTIONS }from'./config';
const keys = require('./config/keys');
const {
  getConfig,
  getPaymentConfig,
  updateConfigLocal
} = require('./lib/config');
const config = getConfig();
const MongoStore = require('connect-mongodb-session')(session);

mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose
  .connect(MONGO_URI, MONGO_OPTIONS)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(colors.red(`MongoDB Connection:${err}`)));

const RedisStore = connectRedis(session);

const client = new Redis(REDIS_OPTIONS);

export const store = new RedisStore({ client });
// session store
export const Mstore = new MongoStore({
  uri: MONGO_URI,
  collection: 'sessions'
});

// const app = createApp(store);
module.exports = {
  mongoose,
  connect: () => {
    mongoose.Promise = Promise;
    mongoose
      .connect(MONGO_URI, MONGO_OPTIONS)
      .then(() => console.log('MongoDB Connected'))
      .catch(err => console.error(colors.red(`MongoDB Connection:${err}`)));
  },
  disconnect: done => {
    mongoose.disconnect(done);
  }
};
