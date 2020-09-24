const express = require("express");
const session = require("express-session");
const parseurl = require("parseurl");
const router = express.Router();
const ratelimit = require("../util/limiter");

router.get("/", ratelimit("pushlimit", 100, "", 5), async (req, res, next) => {
  //   console.log(ratelimit("pushlimit", 100, "", 5));
  console.log(req.body.keygen == true);
  const sessions = session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
  });
  if (!req.session.views) {
    req.session.views = {};
  }

  // get the url pathname
  const pathname = parseurl(req).pathname;

  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
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
      res.locals.metaTags = {
        title: "web-push-api",
        description:
          "Web Push Notification Full Stack Application With Node Js Restful API",
        keywords:
          "Web Push Notification Full Stack Application With Node Js Restful API",
        generator: "0.0.0.1",
        author: "Saurabh Kashyap"
      };
      try {
        return await res
          .status(200)
          .json(`you request here :=> ${req.session.views["/"]} times.`);
      } catch (error) {
        return await res
          .status(200)
          .json(
            ` || Error msg: ${error}`
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
});

module.exports = router;
