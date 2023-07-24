require('dotenv').config({path:__dirname+'./.env'})
import { Options } from'nodemailer/lib/smtp-connection';
import{ IN_PROD, APP_HOSTNAME } from'./app';

const {
  SMTP_HOST = 'mail.tradersboom.com',
  SMTP_PORT = 465,
  SMTP_USERNAME = 'saurabh@tradersboom.com',
  SMTP_PASSWORD = 'puTYMvPrcQMT'
} = process.env;

export const SMTP_OPTIONS = {
  host: SMTP_HOST,
  port: +SMTP_PORT,
  secure: IN_PROD,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD
  }
};
// export const MAIL_FROM = process.env.NODE_ENV == 'development'? `noreply@${APP_HOSTNAME}`:'saurabh@hungermind.com';

export const MAIL_FROM = 'saurabh@tradersboom.com';
