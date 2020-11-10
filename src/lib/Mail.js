import nodemailer from'nodemailer';
import mailConfig from'../config/mmail';

export default nodemailer.createTransport(mailConfig);
