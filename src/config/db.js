// import mongoose from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// // This will create an new instance of "MongoMemoryServer" and automatically start it
// const mongod =  await MongoMemoryServer.create();

// const uri = mongod.getUri();
// import{ ConnectionOptions }from'mongoose';
const {
  MONGO_USERNAME = '',
  MONGO_PASSWORD = '',
  MONGO_HOST = 'localhost',
  MONGO_PORT = 27017,
  MONGO_DATABASE = 'web-push'
} = process.env;

// export const MONGO_URI = `mongodb://${MONGO_USERNAME}:${encodeURIComponent(
//   MONGO_PASSWORD
// )}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;
export const MONGO_URI = 'mongodb://localhost:27017/web-push' || `${uri}/web-push`;

export const MONGO_OPTIONS = {
  useNewUrlParser:true,
  // useCreateIndex:true,
  // useFindAndModify:false,
  useUnifiedTopology: true
};
