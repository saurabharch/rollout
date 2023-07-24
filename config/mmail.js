require("dotenv").config({ path: __dirname + "./.env" });
import { IN_PROD } from "./app";
const {
  SMTP_HOST = process.env.MAIL_HOST,
  SMTP_PORT = process.env.MAIL_PORT,
  auth = {
    SMTP_USERNAME: process.env.MAIL_USER,
    SMTP_PASSWORD: process.env.MAIL_PASS
  }
} = process.env;

export const SMTP_SETTING = {
  host: SMTP_HOST,
  port: +SMTP_PORT,
  secure: IN_PROD,
  auth: {
    user: auth.SMTP_USERNAME,
    pass: auth.SMTP_PASSWORD
  }
};