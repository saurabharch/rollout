import { Options } from'nodemailer/lib/smtp-connection';
import{ IN_PROD, APP_HOSTNAME }from'./app';

const {
  SMTP_HOST = 'smtp.sendgrid.net',
  SMTP_PORT = 25,
  SMTP_USERNAME = 'MLdctucuQ_6zUzymk0n4Hg',
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
