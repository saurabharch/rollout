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
const app = require('../../config/app');
const auth = require('../../config/auth')
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
var  FullData;
router.post(
  '/',
  guest,
  catchAsync(async (req, res) => {
    // await validate(registerSchema, req.body);

    const { email, name, password } = req.body;
    // console.log(JSON.stringify(req.body));
    var testM = [];
    
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
      loginTime: new Date().getTime(),
    });
    // logIn(req, user);

    try {
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
      UserController.store(FullData); // send to Register Queue Worker
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
      status: 'success',
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
