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

// Server certificate by generated script path
const certificate = fs.readFileSync(path.join(__dirname,'../certs',`${process.env.HOSTNAME}-cert.pem`));
const privateKey = fs.readFileSync(path.join(__dirname,'../certs',`${process.env.HOSTNAME}-key.pem`));
const ca = fs.readFileSync(path.join(__dirname,'../certs',`${process.env.HOSTNAME}-csr.pem`));

// Certificate with generated key by letsencrypt
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/pushgeeks.com/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/pushgeeks.com/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/pushgeeks.com/chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

//Create http server with certificate credentials
const https_server = https.createServer(credentials, app);
////////////////////////////////////////////////// HTTPS  ///////////////////////////////////////////////// 
(async () => {
  // const server = await app(store);
  if(process.env.NODE_ENV === 'production'){
    // *Running Application with SSL Certificate*
    https_server.listen(`${APP_PORT}`, () => {
      console.log(`Https Server Running at https://${process.env.APP_HOSTNAME}:${APP_PORT}`)
    })
    
  }else{
    console.log(`Application running at : ${APP_PORT}`)
    app.listen(APP_PORT, () => console.log(`http://localhost:${APP_PORT}`));
}

})();
// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });
