import{ Router }from'express';
import{ guest, catchAsync }from'../middlewares';
// import { validate, registerSchema } from "../validation";
import User from'../model/user';
import Role from "../model/role";
import{ BadRequest }from'../errors';
import{ logIn }from'../auth';
import{ sendMail }from'../mail';
import { v4 as uuidv4 } from 'uuid';
const colors = require("colors");
const router = Router();
import bcrypt from "bcryptjs";
const app = require('../config/app');
const auth = require('../config/auth')
const crypto = require('crypto');
const responseData = require("../util/reponseStatus");
const sendResponse = require("../util/response");
var message = require('../util/responseMessages')
var APP_CONSTANT = require("../util/constants");
import UserController from'../jobs/controller/UserController';
const {
  clearSessionValue,
  mongoSanitize,
  getThemes,
  getId,
  allowedMimeType,
  fileSizeLimit,
  checkDirectorySync,
  sendEmail
} = require('../lib/common');
router.post(
  '/',
  guest,
  catchAsync(async (req, res) => {
    // await validate(registerSchema, req.body);

    const { email, name, password } = req.body;
    // console.log(JSON.stringify(req.body));
    var testM = [];
    const FullData ='';
    const found = await User.exists({email});
    const Roles = await Role.find({ name: ["user"] });
    console.log(colors.yellow(`Result: ${found}`))
    if(found){
      // console.log(`found result${found}`);
      // throw new BadRequest('Invalid email');
      sendResponse(res,responseData.EMAIL_ALREADY_EXITS)
    }
    //const sociaID = uuidv4();
    const username = req.body.email.split('@')[0];
    console.log( `username: ${username}`)
    const sliceUsername = username;
    const userFound =  await User.exists({username});
    var username1 = userFound ? `${sliceUsername}`+ Math.floor( Math.random() * (1000000) + 1): username;
    console.log(colors.red(`Generated Username: ${username1}`))
    
    const {firstName,lastName}=
    {
      firstName:req.body.name.split(' ')[0],
      lastName:req.body.name.split(' ')[1],
    }
    const hashpassword = await bcrypt.hash(req.body.password, 10);
    var data = {
      roles: Roles.map(Role => Role._id),
      username: username1,
      email:req.body.email,
      password: hashpassword,
      firstName:firstName,
      lastName:lastName
    }
    console.log(colors.cyan(`User Info Call Back: ${JSON.stringify(data)}`))
    const user = await User.create({
      roles: data.roles,
      username: data.username,
      email:data.email,
      password: data.password,
      firstName:data.firstName,
      lastName:data.lastName,
      loginTime: new Date(),
    });
    logIn(req, user);

    try {
      // const verificationUrl = function(){
      //   const token = crypto.createHash('sha1').update(user.email).digest('hex');
      //   const expires = Date.now() + auth.EMAIL_VERIFICATION_TIMEOUT;
      //   const url =
      //     `${app.APP_ORIGIN
      //     }/email/verify?id=${
      //     user.id
      //     }&token=${
      //     token
      //     }&expires=${
      //     expires}`;
      //   console.log(`Real Verification Url: ${url}`)
      //   const signature = signVerificationUrl(url);
      //   return `${url}&signature=${signature}`;
      // };
      // const signVerificationUrl = function(url){
      //   const sign = crypto.createHmac('sha256', 'S3Cr3t').update(url).digest('hex');
      //   return sign
      // };
     const link = user.verificationUrl();

     
      // console.log(colors.yellow(`Verification Url : ${link}`))
      // console.log(colors.yellow(`User Data : ${user}`))
      var Cdata = [];
      Cdata.push({roles: data.roles,
        username: data.username,
        email:data.email,
        firstName:data.firstName,
        lastName:data.lastName,
        link: link,
        loginTime: data.loginTime
      });
     FullData = Cdata;
      const serial = '';
      UserController.store(FullData);
      testM.push(FullData);
      // await sendMail({
      //   to: email,
      //   subject: 'Pushgeek Verify email address',
      //   text: link
      // });
      // UserController.store
    } catch (error) {
      console.error(colors.red(`Failed Generating verification url :${error.message}`))
      throw new BadRequest(error.message);
    }
    console.log(JSON.stringify(testM));
    res.status(200).json({
      status: 'succes',
      data: FullData,
    })
  })
);

router.get('/', (req, res) => {
  res.render('index/register', {
      title: 'Register yourself',
      referringUrl: req.header('Referer'),
      config: req.app.config,
      message: clearSessionValue(req.session, 'message'),
      messageType: clearSessionValue(req.session, 'messageType'),
      helpers: req.exphbs.helpers,
      showFooter: 'showFooter'
    });
});

module.exports = router;
// export { router as register };
