const express = require("express");
const router = express.Router();
const os = require("os");
const v8 = require("v8");
// const fs = require("fs");
const SystemInfo = require("../util/lib/SystemVital");
//Server Status Api
router.get("/server", (req, res, next) => {
  try {
    const { request, response } = { request: req, response: res };
    SystemInfo(request, response);
  } catch (error) {
    return next(error);
  }
});
router.get("/sys", (req, res, next) => {
  res.render("index/system-status");
  next();
});
module.exports = router;
