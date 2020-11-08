import nodemailer from "nodemailer";
import { SMTP_OPTIONS } from "../config/mail";

export default nodemailer.createTransport(SMTP_OPTIONS);
