const{ authJwt, verifySignup } = require('../middlewares');
// const {ImageUpload}  = require('../jobs/controller/ImageUpload');

const express = require('express');
const router = express.Router();

router.post('/', [authJwt.verifyToken]);

module.exports = router;
