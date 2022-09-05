require('dotenv').config({path:__dirname+'./.env'})
// import mongoose from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// // This will create an new instance of "MongoMemoryServer" and automatically start it
// const mongod =  await MongoMemoryServer.create();

// const uri = mongod.getUri();
// import{ ConnectionOptions }from'mongoose';
const {
  MONGO_USERNAME = process.env.MONGO_USERNAME,
  MONGO_PASSWORD = process.env.MONGO_PASSWORD,
  MONGO_HOST = process.env.MONGO_HOST,
  MONGO_PORT = process.env.MONGO_PORT,
  MONGO_DATABASE = process.env.MONGO_DATABASE
} = process.env;

export const MONGO_URI = 'mongodb://localhost:27017/web-push' || `${uri}/web-push` || `mongodb+srv://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;
// export const MONGO_URI = 'mongodb://localhost:27017/web-push' || `${uri}/web-push`;

export const MONGO_OPTIONS = {
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:false,
  useUnifiedTopology: true,
  autoIndex: true,
};
