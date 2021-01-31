// import app from "./app";

// app.listen(app.get("port"));

// console.log("Server on port", app.get("port"));
const app = require('./app');
import './database';
const { APP_PORT } = require('./config');

//////////////////////////////////////////START FOR HTTPS  ///////////////////////////////////////////// 
// const https = require('https');
// const fs = require('fs');
// // Certificate
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/johnahn7.com/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/johnahn7.com/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/johnahn7.com/chain.pem', 'utf8');

// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca
// };

//Create http server with certificate credentials
// const https_server = https.createServer(credentials, app);
////////////////////////////////////////////////// HTTPS  ///////////////////////////////////////////////// 
(async () => {
  // const server = await app(store);

  app.listen(APP_PORT, () => console.log(`http://localhost:${APP_PORT}`));
})();
// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });

//*Running Application with SSL Certificate*
// https_server.listen(`${APP_PORT}`, () => {
//   console.log(`Https Server Running at ${APP_PORT}`)
// })