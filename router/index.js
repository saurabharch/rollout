const express = require('express');
const router = express.Router();

const webpush = require("web-push");

const mongoose = require('mongoose');


router.get('/', (req, res) => {
    res.locals.metaTags = {
        title: 'RollOut',
        description: 'RollOut is an award winning blog that talks about living a boss free life with blogging. We cover about WordPress, SEO, Make money Blogging, Affi. marketing.',
        keywords: 'Affiliate Marketing,Money Making, Online Earning, Blog, Science and Technology,Software and web application development',
        generator: 'RollOut MetaTag Generator v.1.0',
        author: 'Saurabh Kashyap'
    };
      res.json({
        status: "ok",
        message: `Server is running keys are`
      });
    res.render('index/home');
});

// router.get("/", (req, res) => {
//   res.locals.metaTags = {
//     title: "web-push-api",
//     description:
//       "Web Push Notification Full Stack Application With Node Js Restful API",
//     keywords:
//       "Web Push Notification Full Stack Application With Node Js Restful API",
//     generator: "0.0.0.1",
//     author: "Saurabh Kashyap"
//   };
//   res.json({
//     status: "ok",
//     message: `Server is running keys are`
//   });
// });

module.exports = router;
