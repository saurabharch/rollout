import*as usersCtrl from'../controllers/user';
import{ authJwt, verifySignup }from'../middlewares';

const express = require('express');
const router = express.Router();

router.post(
  '/',
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    verifySignup.checkDuplicateUsernameOrEmail
  ],
  usersCtrl.createUser
);

module.exports = router;
