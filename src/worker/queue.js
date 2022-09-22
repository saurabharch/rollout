// const fs = require("fs");
// var dotenvPath = undefined;

// if (process.env.DOTENV_PATH) {
//   dotenvPath = process.env.DOTENV_PATH;
//   console.log("load dotenv form DOTENV_PATH", dotenvPath);
// }

// if (process.env.LOAD_DOTENV_SUBFOLDER ) {
//   console.log("load dotenv form LOAD_DOTENV_SUBFOLDER");
//   dotenvPath = __dirname+'/config/.env';
// }
// import "dotenv/config";
// var winston = require('../../config/winston');
// require('dotenv').config({ path: dotenvPath});
// const yenv = require("yenv");
// if (fs.existsSync("./env.yaml")) {
//   process.env = yenv("env.yaml", { strict: false });
// }

// var Queue = require('../lib/Queue');

// try{
//   // console.log(`QueueService.process Type: ${JSON.stringify(QueueService.process())}`);
//   Queue.process();
//   // QueueService.setQueues;
// }catch(err) {
//   // winston.log(' Queue Serice Process :'+err.message);
//   console.log(`Queue Service Process Error: ${err}`)
// }

import "dotenv/config";
import Queue from "../lib/Queue";

Queue.process();