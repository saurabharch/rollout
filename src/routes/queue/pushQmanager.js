import{ authJwt }from'../../middlewares';
import PushController from'../../jobs/controller/PushController';

const express = require('express');
const router = express.Router();

router.post('/queues', PushController.notification);

module.exports = router;
