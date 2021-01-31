import { Options } from'nodemailer/lib/smtp-connection';
import{ IN_PROD, APP_HOSTNAME }from'./app';

const {
  SMTP_HOST = 'smtp.sendgrid.net',
  SMTP_PORT = 25,
  SMTP_USERNAME = 'u-YmJdFYRJy2T-zl4Oz-ew',
  SMTP_PASSWORD = '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'
} = process.env;

export const SMTP_OPTIONS = {
  host: SMTP_HOST,
  port: +SMTP_PORT,
  secure: IN_PROD,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD
  }
};;
// export const MAIL_FROM = process.env.NODE_ENV == 'development'? `noreply@${APP_HOSTNAME}`:'saurabh@hungermind.com';

export const MAIL_FROM = 'saurabh@hungermind.com';
