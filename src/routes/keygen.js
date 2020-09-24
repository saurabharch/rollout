const express = require("express");
const session = require("express-session");
const parseurl = require("parseurl");
const router = express.Router();
const webpush = require("web-push");
const vapidKeys = webpush.generateVAPIDKeys();
// const ratelimit = require('express-rate-limit');
const ratelimit = require("../util/limiter");

router.post("/ServerKey",ratelimit("pushlimit", 100, "", 5),async (req, res, next) => {
    console.log(ratelimit("pushlimit", 100, "", 5));
    console.log(req.body.keygen == true);
    // const sessions = session({
    //   secret: "keyboard cat",
    //   resave: false,
    //   saveUninitialized: true
    // });
    // if (!req.session.views) {
    //   req.session.views = {};
    // }

    // get the url pathname
    // const pathname = parseurl(req).pathname;

    // // count the views
    // req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
    try {
      if (!req.body.keygen) {
        req((error, response, body) => {
          if (error) console.error(error);
          if (response.statusCode !== 200) {
            return res.status(400).json({ msg: "Invalid Request" });
          }
          res.json(JSON.parse(body));
        });
      } else {
        // res.locals.metaTags = {
        //   title: "web-push-api",
        //   description:
        //     "Web Push Notification Full Stack Application With Node Js Restful API",
        //   keywords:
        //     "Web Push Notification Full Stack Application With Node Js Restful API",
        //   generator: "0.0.0.1",
        //   author: "Saurabh Kashyap"
        // };
        try {
          const publickey = await vapidKeys.publicKey;
          const privatekey = await vapidKeys.privateKey;
          return await res.status(200).json(
            // `Server is running keys are - Public key => ${publickey} '/\n' Private key => ${privatekey} \n you request here :=> ${req.session.views["/"]} times.`
            `Server is running keys are - Public key => ${publickey} '/\n' Private key => ${privatekey} \n `
          );
        } catch (error) {
          return await res
            .status(200)
            .json(
              `Server is running keys are - Public key => null '\n' Private key => null || Error msg: ${error}`
            );
          res.end();
        }
        next();
      }
    } catch (error) {
      return await res
        .status(301)
        .json(`Request is not defined|| Error msg: ${error}`);
      res.end();
    }
  }
);

router.get("/", (req, res) => {
  res.json({
    data: "Invalid Request Bad"
  });
});
module.exports = router;
