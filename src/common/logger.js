const chalk = require('chalk');

function getDate() {
  return new Date().toUTCString().split('+')[0];
}

const logger = {
  info(msg) {
    const ts = `- [${getDate()}]`;

    const colorTs = chalk.default.whiteBright(ts);
    const colorMsg = chalk.default.yellow(msg);
    console.log(`${colorTs} - ${colorMsg}`);
  },

  error(msg, stack) {
    const ts = `[${getDate()}]`;

    const colorTs = chalk.default.whiteBright(ts);
    const colorMsg = chalk.default.red(msg);
    const stackTrace = chalk.default.dim(stack);
    console.log(`${colorTs} - ${colorMsg}`);
    console.log(stackTrace);
  },

  success(msg) {
    const ts = `[${getDate()}]`;

    const colorTs = chalk.default.whiteBright(ts);
    const colorMsg = chalk.default.green(msg);
    console.log(`${colorTs} - ${colorMsg}`);
  },
};

module.exports = {
  logger,
};