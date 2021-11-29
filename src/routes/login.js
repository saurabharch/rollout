import*as authCtrl from'../controllers/auth';
import{ catchAsync, guest, auth }from'../middlewares';
// import { validate, loginSchema } from "../validation";
// import{ user }from'../model';
import{ BadRequest }from'../errors';
import{ logIn, logOut }from'../auth';
const express = require('express');
const router = express.Router();
const User = require('../model/user');
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
// import { Router } from 'express';
// const auth = require('../middleware');
// const catchAsync = require('../middleware/errors');

// import { auth, catchAsync } from '../middleware';
// const router = Router();

// const webpush = require("web-push");

// const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  res.locals.metaTags = {
    title: 'PushGeek - Login',
    description:
      'PushGeek is an award winning blog that talks about living a boss free life with blogging. We cover about WordPress, SEO, Make money Blogging, Affi. marketing.',
    keywords:
      'Affiliate Marketing,Money Making, Online Earning, Blog, Science and Technology,Software and web application development',
    generator: 'PushGeek MetaTag Generator v.1.0',
    author: 'Saurabh Kashyap'
  };
  //   res.json({
  //     status: "ok",
  //     message: `Server is running keys are`
  //   });
  const db = req.app.db;

  const userCount = await db.users.countDocuments({});
  // we check for a user. If one exists, redirect to login form otherwise setup
  if(userCount && userCount == 0){
    // set needsSetup to false as a user exists
    req.session.needsSetup = true;
    res.render('index/setup', {
      title: 'Software Setup',
      referringUrl: req.header('Referer'),
      config: req.app.config,
      message: clearSessionValue(req.session, 'message'),
      messageType: clearSessionValue(req.session, 'messageType'),
      helpers: req.exphbs.helpers,
      showFooter: 'showFooter'
    });
  } else{
    //  req.session.needsSetup = true;
    res.render('index/login', { layout: 'main' });
  }
  
});

router.post(
  '/',
  guest,
  // catchAsync(async (req, res) => {
  //   // await validate(loginSchema, req.body);

  //   const { email, password } = req.body;

  //   const User = await User.findOne({ email });

  //   if(!User || !await User.comparePassword(password)){
  //     throw new BadRequest('Incorrect email or password');
  //   }

  //   logIn(req, User._id);

  //   res.json({ message: 'OK' });
  // })
  authCtrl.signin
);

router.post(
  '/logout',
  auth,
  catchAsync(async (req, res) => {
    await logOut(req, res);

    res.json({ message: 'OK' });
  })
);
module.exports = router;
