const express = require("express");
const router = express.Router();
var geoip = require("geoip-lite");
const { ClientRequestData, ClientInfo } = require("../util/lib/ClientDetails");
router.get("/whoami", (req, res, next) => {
  try {
    const { request, response } = { request: req, response: res };
    ClientInfo(request, response);
  } catch (error) {
    return next(error);
  }
});

router.get("/position.js", (req, res, next) => {
  try {
    const { request, response } = { request: req, response: res };
    ClientRequestData(request, response);
  } catch (error) {
    return next(error);
  }
});

router.get("/position.json", (req, res, next) => {
  try {
    const { request, response } = { request: req, response: res };
    ClientRequestData(request, response);
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
