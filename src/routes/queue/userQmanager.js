import{ authJwt }from'../../middlewares';
import UserController from'../../jobs/controller/UserController';

const express = require('express');
const router = express.Router();

router.post('/queues', UserController.store);

module.exports = router;
