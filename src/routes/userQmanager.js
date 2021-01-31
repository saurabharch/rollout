import{ authJwt, verifySignup }from'../middlewares';
import UserController from'../jobs/controller/UserController';

const express = require('express');
const router = express.Router();

router.post('/queues', [authJwt.verifyToken], UserController.store);

module.exports = router;
