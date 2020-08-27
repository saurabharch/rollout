const subscriber = require("./subscriber");
const push = require("./push");
const domains = require("./domains");
const organization = require("./organization");
const reset = require("./reset");
const user = require("./user");
const role = require("./role");

module.exports = {
  ...role,
  ...domains,
  ...subscriber,
  ...organization,
  ...reset,
  ...user
};
