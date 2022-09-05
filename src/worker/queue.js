const fs = require("fs");
var dotenvPath = undefined;

if (process.env.DOTENV_PATH) {
  dotenvPath = process.env.DOTENV_PATH;
  console.log("load dotenv form DOTENV_PATH", dotenvPath);
}

if (process.env.LOAD_DOTENV_SUBFOLDER ) {
  console.log("load dotenv form LOAD_DOTENV_SUBFOLDER");
  dotenvPath = __dirname+'/config/.env';
}

require('dotenv').config({ path: dotenvPath});
const yenv = require("yenv");
if (fs.existsSync("./env.yaml")) {
  process.env = yenv("env.yaml", { strict: false });
}

var {QueueService} = require('../lib/Queue');

try{
  QueueService.process();
}catch(err) {
  winston.log(' Queue Serice Process :'+err.message);
}
