
import{ catchAsync, guest, auth }from'../middlewares';
// import { validate, loginSchema } from "../validation";
// import{ user }from'../model';
import{ BadRequest }from'../errors';
import{ logIn, logOut }from'../auth';
const express = require('express');
const router = express.Router();


router.post(
  '/',
  auth,
  catchAsync(async (req, res) => {
    await logOut(req, res);

    res.json({ message: 'OK' });
  })
);
module.exports = router;

