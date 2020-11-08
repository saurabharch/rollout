import { ConnectionOptions } from "mongoose";
const {
  MONGO_USERNAME = "kappy",
  MONGO_PASSWORD = "Kappy123*",
  MONGO_HOST = "ds215633.mlab.com",
  MONGO_PORT = 15633,
  MONGO_DATABASE = "web-push"
} = process.env;



export const MONGO_URI = `mongodb://${MONGO_USERNAME}:${encodeURIComponent(
  MONGO_PASSWORD
)}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;

export const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};
