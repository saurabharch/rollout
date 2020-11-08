import Mail from "../lib/Mail";
import SMTP_OPTIONS from "../config/mail";

export default {
  key: "RegistrationMail",
  async handle({ data }) {
    const { user } = data;

    await Mail.sendMail({
      from: `PushGeek <${SMTP_OPTIONS.SMTP_USERNAME}@${SMTP_OPTIONS.SMTP_HOST}>`,
      to: `${user.name} <${user.email}>`,
      subject: "pushgeek account is successfully registered",
      html: `Hello, ${user.name}, thank you for your registration request.`
    });
  }
};
