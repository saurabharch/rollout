import{ authJwt, verifySignup }from'../middlewares';
import ImageUpload from'../jobs/controller/ImageUpload';

const express = require('express');
const router = express.Router();

router.post('/', [authJwt.verifyToken], ImageUpload.Thumbnail);

module.exports = router;
