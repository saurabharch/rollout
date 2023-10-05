// export*from'./app';

// export*from'./auth';

// export*from'./db';

// export*from'./cache';

// export*from'./mail';

// export*from'./session';

const {NODE_ENV,APP_PORT,APP_HOSTNAME,HOSTNAME,APP_PROTOCOL,APP_SECRET} = require("./app");
const {BCRYPT_WORK_FACTOR,BCRYPT_MAX_BYTES,EMAIL_VERIFICATION_TIMEOUT,EMAIL_VERIFICATION_TOKEN_BYTES,EMAIL_VERIFICATION_SIGNATURE_BYTES,PASSWORD_RESET_BYTES,PASSWORD_RESET_TIMEOUT} = require("./auth");
const {MONGO_URI,MONGO_OPTIONS} = require("./db");
const {datastorge} = require("./database");
const {REDIS_OPTIONS} = require("./cache");
const {SMTP_OPTIONS,MAIL_FROM} = require("./mmail");
const {SESSION_ABSOLUTE_TIMEOUT,SESSION_OPTIONS} = require("./session");
const {storages} = require("./storage");
//console.log(`mongo URI : ${JSON.stringify(MONGO_URI)} \nmongo options : ${JSON.stringify(MONGO_OPTIONS)} \nredis options : ${JSON.stringify(REDIS_OPTIONS)} \nmail options : ${JSON.stringify(SMTP_OPTIONS)} \nsession options : ${JSON.stringify(SESSION_OPTIONS)} \napp secret : ${JSON.stringify(APP_SECRET)} \napp port : ${JSON.stringify(APP_PORT)} \napp hostname : ${JSON.stringify(APP_HOSTNAME)} \napp protocol : ${JSON.stringify(APP_PROTOCOL)} \napp env : ${JSON.stringify(NODE_ENV)} \nbcrypt work factor : ${JSON.stringify(BCRYPT_WORK_FACTOR)} \nbcrypt max bytes : ${JSON.stringify(BCRYPT_MAX_BYTES)} \nemail verification timeout : ${JSON.stringify(EMAIL_VERIFICATION_TIMEOUT)} \nemail verification token bytes : ${JSON.stringify(EMAIL_VERIFICATION_TOKEN_BYTES)} \nemail verification signature bytes : ${JSON.stringify(EMAIL_VERIFICATION_SIGNATURE_BYTES)} \npassword reset bytes : ${JSON.stringify(PASSWORD_RESET_BYTES)} \npassword reset timeout : ${JSON.stringify(PASSWORD_RESET_TIMEOUT)} \nstorage : ${JSON.stringify(storages)}`);
module.exports = {
  NODE_ENV,
  APP_PORT,
  APP_HOSTNAME,
  HOSTNAME,
  APP_PROTOCOL,
  APP_SECRET,
  BCRYPT_WORK_FACTOR,
  BCRYPT_MAX_BYTES,
  EMAIL_VERIFICATION_TIMEOUT,
  EMAIL_VERIFICATION_TOKEN_BYTES,
  EMAIL_VERIFICATION_SIGNATURE_BYTES,
  PASSWORD_RESET_BYTES,
  PASSWORD_RESET_TIMEOUT,
  MONGO_URI,
  MONGO_OPTIONS,
  REDIS_OPTIONS,
  SMTP_OPTIONS,
  MAIL_FROM,
  SESSION_ABSOLUTE_TIMEOUT,
  SESSION_OPTIONS,
  storages,
  datastorge
};

var _ = require('lodash');
var path = require('path');
var extend = require('deep-extend');
require('json5/lib/require');

function Config(opts) {}

function _getCallerFile() {
  try {
    var oldPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function(err, stack) { return stack; };
    var stack = new Error().stack;
    Error.prepareStackTrace = oldPrepareStackTrace;
    return stack[2].getFileName()
  } catch (err) {}
  return undefined;
}

Config.prototype.set = function (opts, silent) {
  if (typeof opts === 'object') {
    extend(this, opts);
  } else if (typeof opts === 'function') {
    extend(this, opts(this));
  } else if (typeof opts === 'string') {
    try {
      var callerFile = _getCallerFile();
      var moduleFile = path.join(path.dirname(callerFile), opts);
      var module = require(moduleFile);
      this.set(module)
    } catch (e) {
      if (!silent) { 
        console.log(e)
      }
    }
  }
}

Config.prototype.get = function (key) {
  return _.get(this, key);
}

Config.prototype.Config = Config;

module.exports = new Config();