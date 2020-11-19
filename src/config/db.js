import { ConnectionOptions } from "mongoose";
const {
  MONGO_USERNAME = "",
  MONGO_PASSWORD = "*",
  MONGO_HOST = "",
  MONGO_PORT = 27017,
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
