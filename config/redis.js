require('dotenv').config({path:__dirname+'./.env'});

const {
  REDIS_PORT = process.env.REDIS_PORT,
  REDIS_HOST = process.env.REDIS_HOST,
  REDIS_DB = process.env.REDIS_DATABASE,
  REDIS_PASSWORD = process.env.REDIS_PASSWORD,
  REDIS_LINK = process.env.REDIS_URL,
  REDIS_TLS = process.env.REDIS_TLS
} = process.env;
export default {
  host: REDIS_HOST,
  port: REDIS_PORT,
  database: REDIS_DB,
  password: REDIS_PASSWORD,
  url: REDIS_LINK,
  tls: REDIS_TLS
};
