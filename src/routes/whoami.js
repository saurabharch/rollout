const express = require("express");
const router = express.Router();
var geoip = require("geoip-lite");

router.get("/whoami", (req, res, next) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const headers = {
      ipaddress: ip,
      language: req.headers["accept-language"],
      software: req.headers["user-agent"]
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(headers));
  } catch (error) {
    console.error(`Error occurred while saving subscription. Err: ${error}`);
    res.status(500).json({
      error: "Technical error occurred"
    });
  }
});

router.get("/api/position.js", (req, res, next) => {
  try {
    //   var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    var requestlenght = req.baseUrl;
    if (!req.params[0] === "position.js") {
      res.status(301).json({ message: "Request Method Not Allowed" });
    } else {
      const forwarded = req.headers["x-forwarded-for"] || "157.42.44.163";
      var ip = forwarded
        ? forwarded.split(/, /)[0]
        : req.connection.remoteAddress;
      var geo = geoip.lookup(ip);
      console.log(process.memoryUsage());
      const headers = {
        ipaddress: ip,
        language: req.headers["accept-language"],
        software: req.headers["user-agent"],
        cordinate: geo
      };
      res.status(200).json({ getAddress: headers });
    }
  } catch (error) {
    console.error(`Error occurred while saving subscription. Err: ${error}`);
    res.status(500).json({ error: `Technical error occurred ${error}` });
  }
  next();
});

module.exports = router;
