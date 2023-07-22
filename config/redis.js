require('dotenv').config({path:__dirname+'./.env'});
export default{
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    database: process.env.REDIS_DATABASE,
    password: process.env.REDIS_PASSWORD,
    url: process.env.REDIS_URL,
    tls:process.env.REDIS_TLS
  };
