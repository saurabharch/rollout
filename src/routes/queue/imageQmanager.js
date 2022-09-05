import{ authJwt }from'../../middlewares';
import FileController from'../../jobs/controller/FileController';

const express = require('express');
const router = express.Router();

router.post('/queues', FileController.Thumbnail);

module.exports = router;
