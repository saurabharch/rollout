import{ Options }from'nodemailer/lib/smtp-connection';
import{ IN_PROD, APP_HOSTNAME }from'./app';

const {
  SMTP_HOST = 'smtp.mailtrap.io',
  SMTP_PORT = 25,
  SMTP_USERNAME = 'dfbb68d8f68da6',
  SMTP_PASSWORD = '963a2b2c7f5457'
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

// export const MAIL_FROM = `noreply@${APP_HOSTNAME}`;

export const MAIL_FROM = '3fa6a36c53-4a4f42@inbox.mailtrap.io';
