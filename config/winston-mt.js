// UNUSED
var appRoot = require('app-root-path');
var winston = require('winston');
var config = require('./database');

var level = process.env.LOG_LEVEL || 'info'
// console.log("level",level);

var options = {
    file: {
      level:level ,
      filename: `${appRoot}/logs/app.log`,
      handleExceptions: true,
      json: false,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
      format: winston.format.simple()
    }
  };

  let logger = winston.createLogger({    
    transports: [
     new (winston.transports.File)(options.file),
    ],
    exitOnError: false, // do not exit on handled exceptions
  });




  if (process.env.WRITE_LOG_MT_TO_MONGODB=="true") {
    //require('winston-mongodb');
    require('../src/utils/winston-mongodb/winston-mongodb');

    if (process.env.NODE_ENV == 'test')  {
      var logsDb = config.databasetest;
    }else {
      var logsDb = config.database;
    }

    console.log("Added winston MongoDB transport");
    logger.add(new winston.transports.MongoDB({db: logsDb, level: process.env.LOG_MONGODB_LEVEL || 'info', collection: "logs"}));
  }
  if (process.env.WRITE_LOG_MT_TO_MONGODB=="true") {
    //require('winston-mongodb');
    require('../src/utils/winston-mongodb/winston-mongodb');

    if (process.env.NODE_ENV == 'test')  {
      var logsDb = process.env.DATABASE_LOG_MT_URI || process.env.DATABASE_LOG_URI ||  process.env.DATABASE_URI || process.env.MONGODB_URI || config.databasetest;
    }else {
      var logsDb = process.env.DATABASE_LOG_MT_URI || process.env.DATABASE_LOG_URI ||  process.env.DATABASE_URI || process.env.MONGODB_URI || config.database;
    }
  }else if(process.env.WRITE_LOG_MT_TO_REDISDB=="true"){
    require('../src/utils/winston-redisdb/winston-redisdb');
     if (process.env.NODE_ENV == 'test')  {
      var logsDb = config.databasetest;
    }else {
      var logsDb = config.databaselogs;
    }

    
  }



  logger.stream = { 
    write: function(message, encoding) {
      logger.info(message);
    },
  };

  // if (process.env.NODE_ENV !== 'production') {
  //   logger.add(new winston.transports.Console({
  //     format: winston.format.simple()
  //   }));
  // }


  module.exports = logger;
