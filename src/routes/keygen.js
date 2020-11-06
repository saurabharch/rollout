const express = require("express");
const session = require("express-session");
const parseurl = require("parseurl");
const router = express.Router();
// const ratelimit = require('express-rate-limit');
const ratelimit = require("../util/limiter");
const vapidKeygen = require("../util/lib/VapidKeyGen");
router.post(
  "/ServerKey",
  ratelimit("pushlimit", 100, "", 5),
  async (req, res, next) => {
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
      const { request, response } = { request: req, response: res };
      vapidKeygen(request, response);
    } catch (error) {
      return next(error);
    }
  }
);

router.get("/", (req, res) => {
  res.json({
    data: "Invalid Request Bad"
  });
});
module.exports = router;
