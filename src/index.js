// import app from "./app";

// app.listen(app.get("port"));

// console.log("Server on port", app.get("port"));
const app = require('./app');
// import './database';
const { APP_PORT } = require('../config');
require('dotenv').config()
//////////////////////////////////////////START FOR HTTPS  ///////////////////////////////////////////// 
const fs = require('fs');
const path = require('path');
const https = require('https');
var debug = require('debug')('rollout-server:server');
var http = require('http');
var version = require('../package.json').version
var mongoose = require('mongoose');
// Server certificate by generated script path
const certificate = fs.readFileSync(path.join(__dirname,'../certs',`${process.env.HOSTNAME}-cert.pem`));
const privateKey = fs.readFileSync(path.join(__dirname,'../certs',`${process.env.HOSTNAME}-key.pem`));
const ca = fs.readFileSync(path.join(__dirname,'../certs',`${process.env.HOSTNAME}-csr.pem`));
var webSocketServer = require('./websocket/webSocketServer');
// Certificate with generated key by letsencrypt
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/pushgeeks.com/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/pushgeeks.com/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/pushgeeks.com/chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}



////////////////////////////////////////////////// HTTPS  ///////////////////////////////////////////////// 
(async () => {
  // const server = await app(store);
  if(process.env.NODE_ENV === 'production'){
    var port = normalizePort(process.env.APP_PORT || '5500');
    app.set('port', port);
    // *Running Application with SSL Certificate*
    //Create http server with certificate credentials
    const https_server = https.createServer(credentials, app);
    
    webSocketServer.init(https_server);
   var listener = https_server.listen(port, function() {
      console.log(`Https Server Running at https://${process.env.APP_HOSTNAME}:${APP_PORT}`);
       console.log('Listening rollout-server ver:'+version+' on port ' + listener.address().port); //Listening on port 8888
    });
    /**
   * Event listener for HTTP server "listening" event.
   */

    function onListening() {
      var addr = https_server.address();
      var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      debug('Listening on ' + bind);
    }
    https_server.on('error', onError);
    https_server.on('listening', onListening);
    
  }else{
    var port = normalizePort(process.env.APP_PORT || '5500');
    app.set('port', port);
    // *Running Application without SSL Certificate*
    //Create http server without certificate credentials
    const http_server = http.createServer(app);
    
  webSocketServer.init(http_server);
   var listener = http_server.listen(port, function() {
      console.log(`Https Server Running at https://${process.env.APP_HOSTNAME}:${APP_PORT}`);
       console.log('Listening rollout-server ver:'+version+' on port ' + listener.address().port); //Listening on port 8888
    });
      /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
      var addr = http_server.address();
      var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      debug('Listening on ' + bind);
    }
    http_server.on('error', onError);
    http_server.on('listening', onListening);
}

})();
// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });
