const express = require("express");
const router = express.Router();
import { catchAsync, guest, auth } from "../middlewares";
// import { validate, loginSchema } from "../validation";
import { user } from "../model";
import { BadRequest } from "../errors";
import { logIn, logOut } from "../auth";
// import { Router } from 'express';
// const auth = require('../middleware');
// const catchAsync = require('../middleware/errors');

// import { auth, catchAsync } from '../middleware';
// import { User } from '../models';
//const router = Router();

// const webpush = require("web-push");

// const mongoose = require('mongoose');

router.get("/", (req, res) => {
  res.locals.metaTags = {
    title: "PushGeek - Login",
    description:
      "PushGeek is an award winning blog that talks about living a boss free life with blogging. We cover about WordPress, SEO, Make money Blogging, Affi. marketing.",
    keywords:
      "Affiliate Marketing,Money Making, Online Earning, Blog, Science and Technology,Software and web application development",
    generator: "PushGeek MetaTag Generator v.1.0",
    author: "Saurabh Kashyap"
  };
  //   res.json({
  //     status: "ok",
  //     message: `Server is running keys are`
  //   });
  res.render("index/login", { layout: "main" });
});

router.post(
  "/api/login",
  guest,
  catchAsync(async (req, res) => {
    // await validate(loginSchema, req.body);

    const { email, password } = req.body;

    const User = await user.findOne({ email });

    if (!User || !await user.matchesPassword(password)) {
      throw new BadRequest("Incorrect email or password");
    }

    logIn(req, User.id);

    res.json({ message: "OK" });
  })
);

router.post(
  "/api/logout",
  auth,
  catchAsync(async (req, res) => {
    await logOut(req, res);

    res.json({ message: "OK" });
  })
);
module.exports = router;
