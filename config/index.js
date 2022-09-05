// export*from'./app';

// export*from'./auth';

// export*from'./db';

// export*from'./cache';

// export*from'./mail';

// export*from'./session';

const {NODE_ENV,APP_PORT,APP_HOSTNAME,APP_PROTOCOL,APP_SECRET} = require("./app");
const {BCRYPT_WORK_FACTOR,BCRYPT_MAX_BYTES,EMAIL_VERIFICATION_TIMEOUT,EMAIL_VERIFICATION_TOKEN_BYTES,EMAIL_VERIFICATION_SIGNATURE_BYTES,PASSWORD_RESET_BYTES,PASSWORD_RESET_TIMEOUT} = require("./auth");
const {MONGO_URI,MONGO_OPTIONS} = require("./db");
const {REDIS_OPTIONS} = require("./cache");
const {SMTP_OPTIONS,MAIL_FROM} = require("./mail");
const {SESSION_ABSOLUTE_TIMEOUT,SESSION_OPTIONS} = require("./session")
const {storages} = require("./storage");
//console.log(`mongo URI : ${JSON.stringify(MONGO_URI)} \nmongo options : ${JSON.stringify(MONGO_OPTIONS)} \nredis options : ${JSON.stringify(REDIS_OPTIONS)} \nmail options : ${JSON.stringify(SMTP_OPTIONS)} \nsession options : ${JSON.stringify(SESSION_OPTIONS)} \napp secret : ${JSON.stringify(APP_SECRET)} \napp port : ${JSON.stringify(APP_PORT)} \napp hostname : ${JSON.stringify(APP_HOSTNAME)} \napp protocol : ${JSON.stringify(APP_PROTOCOL)} \napp env : ${JSON.stringify(NODE_ENV)} \nbcrypt work factor : ${JSON.stringify(BCRYPT_WORK_FACTOR)} \nbcrypt max bytes : ${JSON.stringify(BCRYPT_MAX_BYTES)} \nemail verification timeout : ${JSON.stringify(EMAIL_VERIFICATION_TIMEOUT)} \nemail verification token bytes : ${JSON.stringify(EMAIL_VERIFICATION_TOKEN_BYTES)} \nemail verification signature bytes : ${JSON.stringify(EMAIL_VERIFICATION_SIGNATURE_BYTES)} \npassword reset bytes : ${JSON.stringify(PASSWORD_RESET_BYTES)} \npassword reset timeout : ${JSON.stringify(PASSWORD_RESET_TIMEOUT)} \nstorage : ${JSON.stringify(storages)}`);
module.exports = {
    NODE_ENV,
    APP_PORT,
    APP_HOSTNAME,
    APP_PROTOCOL,
    APP_SECRET,
    BCRYPT_WORK_FACTOR,
    BCRYPT_MAX_BYTES,
    EMAIL_VERIFICATION_TIMEOUT,
    EMAIL_VERIFICATION_TOKEN_BYTES,
    EMAIL_VERIFICATION_SIGNATURE_BYTES,
    PASSWORD_RESET_BYTES,
    PASSWORD_RESET_TIMEOUT,
    MONGO_URI,MONGO_OPTIONS,
    REDIS_OPTIONS,
    SMTP_OPTIONS,MAIL_FROM,
    SESSION_ABSOLUTE_TIMEOUT,
    SESSION_OPTIONS,
    storages
}