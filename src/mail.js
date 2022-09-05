import nodemailer, { SendMailOptions } from "nodemailer";
import { SMTP_OPTIONS, MAIL_FROM } from "../config";

const transporter = nodemailer.createTransport(SMTP_OPTIONS);

export const sendMail = async options =>
 await transporter.sendMail({
    ...options,
    from: MAIL_FROM
  });
