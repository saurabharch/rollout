const express = require('express');
import{ catchAsync, isAuthenticated, isClientAuthenticated }from'../middlewares';
const router = express.Router();
const authController = require('../middlewares/auth');
const oauth2Controller = require('../controllers/oauth2');
// const clientController = require('../controllers/client');
// Load required packages
import Client from "../model/client";
// Create endpoint handlers for /clients
router.get('/',(req,res)=>{
    res.render('index/client');
})
// router.route('/api')
//   .post(authController.isAuthenticated, clientController.postClients)
//   .get(authController.isAuthenticated, clientController.getClients);
router.post('/oauth2/authorize',  catchAsync(async (req, res) => {
      // Use the Client model to find all clients
  // Create a new instance of the Client model
  const {client_id,response_type,redirect_uri} = req.params;
  var client = new Client();

  // Set the client properties that came from the POST data
  client.name = req.body.name;
  client.id = req.body.id;
  client.secret = req.body.secret;
  client.userId = req.body._id;
  client.redirect_uri = req.body.redirect_uri

  // Save the client and check for errors
  client.save(function(err) {
    if (err)
      return res.send(err);

    res.json({ message: 'Client added to the locker!', data: client });
  });
}));
router.get('/oauth2/authorize',  catchAsync(async (req, res) => {
     // Use the Client model to find all clients
     const {client_id,response_type,redirect_uri} = req.params;
  Client.find({'id':{$in:client_id}}, function(err, clients) {
    if (err)
      return res.send(err);

    res.json(clients);
  }).exec();
}));
// router.post(
//     '/',
//     [
//       authJwt.verifyToken,
//       authJwt.isAdmin,
//       verifySignup.checkDuplicateUsernameOrEmail
//     ],
//     usersCtrl.createUser
//   );
// Create endpoint handlers for oauth2 authorize
router.route('/oauth2/authorize')
  .get(isAuthenticated, oauth2Controller.authorization)
  .post(isAuthenticated, oauth2Controller.decision);
// router.get('/api/oauth2/authorize',authController.isAuthenticated,oauth2Controller.authorization);
// router.post('/api/oauth2/authorize',authController.isAuthenticated,oauth2Controller.decision);
// Create endpoint handlers for oauth2 token
router.route('/oauth2/token')
  .post(isClientAuthenticated, oauth2Controller.token);
// router.post('/api/oauth2/token',authController.isClientAuthenticated,oauth2Controller.token);
module.exports = router;
