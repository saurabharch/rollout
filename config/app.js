require('dotenv').config({path:__dirname+'./.env'})

 export const NODE_ENV = 'development';

 export const APP_PORT = 5500;
 export const APP_HOSTNAME = 'localhost' || process.env.APP_HOSTNAME;
 export const HOSTNAME = 'localhost' || process.env.HOSTNAME;
 export const  APP_PROTOCOL = 'http' ||'https';

 export const APP_SECRET = '4d2ca599b4189f74a771f44b8a8d06f572208b5649f5ae216f8e94612a267ff0';
  //SUPPRESS_NO_CONFIG_WARNING = false
export const APP_ORIGIN = `${APP_PROTOCOL}://${APP_HOSTNAME}:${APP_PORT}`;

export const IN_PROD = NODE_ENV === 'production';

module.exports={
  APP_ORIGIN,
  APP_SECRET,
  APP_PORT,
  APP_HOSTNAME,
  HOSTNAME,
  APP_PROTOCOL,
  IN_PROD
}
