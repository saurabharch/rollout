import Mail from'../lib/Mail';
import MAIL_FROM from'../config/mail';

export default{
  key: 'RegistrationMail',
  async handle({ data }){
    const { user } = data;
    console.log(`Send Data for Mail : ${user}`)
    await Mail.sendMail({
      from: `PushGeek <${MAIL_FROM}>`,
      to: `${user.firstName} <${user.email}>`,
      subject: 'pushgeek account is successfully registered',
      html: `Hello, ${user.firstName} ${user.lastName}, thank you for your registration request. \n your are registered as \n <b>${user.username}<b>link ${user.link}`
    });
  }
};
