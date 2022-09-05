// const mongoose = require("mongoose");
require('dotenv').config({path:__dirname+'../config/.env'})
import mongoose from'mongoose';
import session from'express-session';
import connectRedis from'connect-redis';
import Redis from'ioredis';
const colors = require("colors");
import{ MONGO_URI, MONGO_OPTIONS, REDIS_OPTIONS } from'../config';
const keys = require('../config/keys');
const {
  getConfig,
  getPaymentConfig,
  updateConfigLocal
} = require('./lib/config');
const config = getConfig();
const MongoStore = require('connect-mongodb-session')(session);
var winston = require('../config/winston');
const MaskData = require("maskdata");
mongoose.Promise = global.Promise;

if (!MONGO_URI) { //TODO??
  winston.warn('DATABASE_URI not specified, falling back to localhost.');
}
const masked_databaseUri = MaskData.maskPhone(MONGO_URI, {
        maskWith : "*",
        unmaskedStartDigits: 15, 
        unmaskedEndDigits: 5
      });
if (process.env.DISABLE_MONGO_PASSWORD_MASK ==true || process.env.DISABLE_MONGO_PASSWORD_MASK == "true")  {
  winston.info("DatabaseUri: " + MONGO_URI);
}else {
  winston.info("DatabaseUri: " + masked_databaseUri);
}

var autoIndex = true;
if (process.env.MONGOOSE_AUTOINDEX) {
  autoIndex = process.env.MONGOOSE_AUTOINDEX;
}

winston.info("DB AutoIndex: " + autoIndex);
// Mongoose Connect
 mongoose
  .createConnection(MONGO_URI, MONGO_OPTIONS)
  .then(() => console.log('MongoDB Connected'))
  .catch(err =>{
    if(err.message.code === 'ETIMEDOUT') {
      winston.error('MongoDB Connection Timed Out. Please make sure MongoDB is running.');
      process.exit(1);
    }
    else{
      winston.error('Failed to connect to MongoDB on ' + MONGO_URI + " ", err);
      process.exit(1);
    }
  });
if (process.env.MONGOOSE_DEBUG==="true") {
  mongoose.set('debug', true);
}

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
  store,
  client,
  Mstore,
  mongoose,
  connect: () => {
    mongoose.Promise = Promise;
    mongoose
      .connect(MONGO_URI, MONGO_OPTIONS)
      .then(() => console.log('MongoDB Connected'))
      .catch(err => {
    if(err.message.code === 'ETIMEDOUT') {
      winston.error('MongoDB Connection Timed Out. Please make sure MongoDB is running.');
      //process.exit(1);
    }
    else{
      winston.error('Failed to connect to MongoDB on ' + MONGO_URI + " ", err);
      //process.exit(1);
    }
  });
  },
  disconnect: async done => {
   await mongoose.disconnect(done);
  //  winston.error('Disconnect to MongoDB on ' + MONGO_URI + " ", err);
  //  process.exit(1);
  }
};
