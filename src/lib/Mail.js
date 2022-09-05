const nodemailer = require('nodemailer');
const mailConfig = require('../../config/mmail');

export default nodemailer.createTransport(mailConfig);

