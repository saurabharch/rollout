import{ ConnectionOptions }from'mongoose';
const {
  MONGO_USERNAME = '',
  MONGO_PASSWORD = '',
  MONGO_HOST = 'localhost',
  MONGO_PORT = 15633,
  MONGO_DATABASE = 'web-push'
} = process.env;

// export const MONGO_URI = `mongodb://${MONGO_USERNAME}:${encodeURIComponent(
//   MONGO_PASSWORD
// )}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;
export const MONGO_URI = 'mongodb+srv://kappy:Kappy123*@cluster0-nikh7.mongodb.net/test?retryWrites=true&w=majority'

export const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};
