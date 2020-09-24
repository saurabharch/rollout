const home = require("./home");
const push = require("./push");
const subscribe = require("./subscribe");
const textClassification = require("./textClassification");
const systemStatus = require("./systemStatus");
const timestamp = require("./timestamp");
const whoami = require("./whoami");
const keygen = require("./keygen");
const login = require("./login");
const reset = require("./reset");
const register = require("./register");
const verify = require("./verify");
module.exports = {
  ...home,
  ...push,
  ...subscribe,
  ...textClassification,
  ...systemStatus,
  ...timestamp,
  ...whoami,
  ...keygen,
  ...login,
  ...reset,
  ...register,
  ...verify
};
