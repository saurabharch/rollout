const express = require("express");
const router = express.Router();

import * as usersCtrl from "../controllers/user";
import { authJwt, verifySignup } from "../middlewares";

router.post(
  "/",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    verifySignup.checkDuplicateUsernameOrEmail
  ],
  usersCtrl.createUser
);

module.exports = router;
