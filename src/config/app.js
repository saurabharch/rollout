export const {
  NODE_ENV = 'development',

  APP_PORT = 5500,
  APP_HOSTNAME = 'localhost' || process.env.APP_HOSTNAME,
  APP_PROTOCOL = 'http',

  APP_SECRET = '4d2ca599b4189f74a771f44b8a8d06f572208b5649f5ae216f8e94612a267ff0',
  //SUPPRESS_NO_CONFIG_WARNING = false
} = process.env;

export const APP_ORIGIN = `${APP_PROTOCOL}://${APP_HOSTNAME}:${APP_PORT}`;

export const IN_PROD = NODE_ENV === 'production';
