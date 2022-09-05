// // import { config } from "dotenv";
// // config();
// const ONE_DAY = 1000 * 60 * 60 * 24;

// // export const {
// //   HTTP_PORT = 3000,
// const NODE_ENV = "development";

// //   DB_USERNAME = "admin",
// //   DB_PASSWORD = "secret",
// //   DB_HOST = "localhost",
// //   DB_PORT = 27017,
// //   DB_NAME = "chat",


// const SESS_LIFETIME = ONE_DAY;

// const REDIS_HOST = "localhost";
// const REDIS_PORT = 6379;
// const REDIS_PASSWORD = "secret";
// // } = process.env;

// // export 
// const IN_PROD = NODE_ENV === "production";
// const EMAIL_VERIFICATION_TIMEOUT = '';
// const EMAIL_VERIFICATION_TOKEN_BYTES='';
// const EMAIL_VERIFICATION_SIGNATURE_BYTES='';
// const PASSWORD_RESET_BYTES='';
// const PASSWORD_RESET_TIMEOUT='';
// // // // Password URL encoded to escape special characters
// // export const DB_URI = `mongodb://${DB_USERNAME}:${encodeURIComponent(
// //   DB_PASSWORD
// // )}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// // export const DB_OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true };

// export const REDIS_OPTIONS = {
//   host: REDIS_HOST,
//   port: +REDIS_PORT,
//   password: REDIS_PASSWORD
//   // TODO: retry_strategy
// };
//  export const SESS_NAME = "sid";
//  export const SESS_SECRET = "ssh!secret!";
// module.exports = {
// SESS_OPTIONS : {
//   name: SESS_NAME,
//   secret: SESS_SECRET,
//   resave: true,
//   rolling: true,
//   saveUninitialized: false,
//   cookie: {
//     maxAge: +SESS_LIFETIME,
//     sameSite: true,
//     secure: IN_PROD
//   }
// },
// BCRYPT_WORK_FACTOR:12,

// BCRYPT_MAX_BYTES:72,

// // Verification email

// EMAIL_VERIFICATION_TIMEOUT: TWELVE_HOURS,

// // sha1 -> 160 bits / 8 = 20 bytes * 2 (hex) = 40 bytes
// EMAIL_VERIFICATION_TOKEN_BYTES: 40,

// // sha256 -> 256 bits / 8 = 32 bytes * 2 (hex) = 64 bytes
// EMAIL_VERIFICATION_SIGNATURE_BYTES: 64,

// // Password reset
// PASSWORD_RESET_BYTES: 40,
// PASSWORD_RESET_TIMEOUT: ONE_HOUR,
// }

// // export const APOLLO_OPTIONS = {
// //   playground: IN_PROD
// //     ? false
// //     : {
// //         settings: {
// //           "request.credentials": "include"
// //         }
// //       }
// // };

// const ONE_HOUR = 1000 * 60 * 60;

// const TWELVE_HOURS = ONE_HOUR * 12;

// // Bcrypt


const ONE_HOUR = 1000 * 60 * 60;

const TWELVE_HOURS = ONE_HOUR * 12;

// Bcrypt

export const BCRYPT_WORK_FACTOR = 12;

export const BCRYPT_MAX_BYTES = 72;

// Verification email

export const EMAIL_VERIFICATION_TIMEOUT = TWELVE_HOURS;

// sha1 -> 160 bits / 8 = 20 bytes * 2 (hex) = 40 bytes
export const EMAIL_VERIFICATION_TOKEN_BYTES = 40;

// sha256 -> 256 bits / 8 = 32 bytes * 2 (hex) = 64 bytes
export const EMAIL_VERIFICATION_SIGNATURE_BYTES = 64;

// Password reset

export const PASSWORD_RESET_BYTES = 40;

export const PASSWORD_RESET_TIMEOUT = ONE_HOUR;