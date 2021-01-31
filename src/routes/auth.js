import*as authCtrl from'../controllers/auth';
import{ verifySignup }from'../middlewares';
const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.post(
  '/signup',
  [verifySignup.checkDuplicateUsernameOrEmail, verifySignup.checkRolesExisted],
  authCtrl.signUp
);

router.post('/signin', authCtrl.signin);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('index/dashboard');
  }
);

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: [{ scope: ['email', 'public_profile', 'user_location'] }]
  })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
  })
);

router.get('/twitter', passport.authenticate('twitter'));

router.get(
  '/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/'
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('index/admin');
  }
);

router.get('/pinterest', passport.authenticate('pinterest'));

router.get(
  '/pinterest/callback',
  passport.authenticate('pinterest', {
    failureRedirect: '/'
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('index/dashboard');
  }
);

router.get('/instagram', passport.authenticate('instagram'));

router.get(
  '/instagram/callback',
  passport.authenticate('instagram', {
    failureRedirect: '/'
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('index/dashboard');
  }
);

router.get('/verify', (req, res) => {
  if(req.user){
    console.log(req.user);
  }else{
    console.log('Not Auth');
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
