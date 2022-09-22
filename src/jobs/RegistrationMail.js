const Mail = require('../lib/Mail');
const {MAIL_FROM} = require('../../config/mail');
const isOnline = require('is-online');
var template = require('../lib/mailtemplategen');

export default{
  key: 'RegistrationMail',
  async handle({ data }){
    const { user } = JSON.stringify(data);
    console.log(`Send Data for Mail : ${user[0].firstName}`)
    isOnline().then(async online => {
    if(online){
        console.log("We have internet");
        

          try {
            var option = {
                            viewEngine: {
                                extname: '.handlebars', // handlebars extension
                                layoutsDir: '../template/layouts/', // location of handlebars templates
                                defaultLayout: 'template.handlebars', // name of main template
                                partialsDir : '../template/partials'
                            },
                            viewPath: '../template/registration',
                            extName: '.handlebars',
              };

            await Mail.use('compile',template(option));
            var mail = {
              from: `PushGeek <${MAIL_FROM}>`,
              to: `${user.firstName} <${user.email}>`,
              subject: 'pushgeek account is successfully registered',
              template: 'registration',
              context: {
                  name: `${user.firstName} ${user.lastName}`,
                  username:`${user.username}`,
                  activationlink:`${user.link}`,
                  logoImg: `${process.env.logoPath}` || 'https://raindigi.com/wp-content/uploads/2018/10/Rain-DiGi-Solution-Logo.png',
                  companyname:`${process.env.companyname}` || 'RainDigi IT Pvt. Ltd.',
                  footeraddress: `${process.env.footeraddress}` || 'Office No:- A/305, Capital Tower, Block-A, Fraser Road, Patna-800001, Bihar',
                  whatsApp: `${process.env.whatsApp}` || '919110983897?text=Hello Saurabh,I Need Help Some help regards Rollout server',
                  twitterLink: `${process.env.twitterLink}` || '#',
                  facebookLink: `${process.env.facebookLink}` || '#'
              }
            }
            await Mail.sendMail(mail);
          //   await Mail.sendMail({
          //   from: `PushGeek <${MAIL_FROM}>`,
          //   to: `${user.firstName} <${user.email}>`,
          //   subject: 'pushgeek account is successfully registered',
          //   html: `Hello, ${user.firstName} ${user.lastName}, thank you for your registration request. \n your are registered as \n <b>${user.username}<b>link ${user.link}`
          // });
           
        } catch (error) {
          if (error.response) {
              // await Mail.moveToFailed({message: 'job failed'});
              console.log(`Email Sending Accident : ${error.message}`)
            }
     }
    }else{
        console.log("Saurabh we have a problem");
    }
  });
  }
};
