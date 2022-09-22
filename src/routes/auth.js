import*as authCtrl from'../controllers/auth';
import{ verifySignup }from'../middlewares';
const express = require('express');
const router = express.Router();
const passport = require('passport');
const ratelimit = require('../util/limiter');

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.post(
  '/signup',ratelimit('pushlimit', 10, '', 1),
  [verifySignup.checkDuplicateUsernameOrEmail, verifySignup.checkRolesExisted],
  authCtrl.signUp
);

router.post('/signin',ratelimit('pushlimit', 10, '', 1), authCtrl.signin);

router.get(
  '/google',
  ratelimit('pushlimit', 10, '', 1),
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  ratelimit('pushlimit', 10, '', 1),
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.render('index/dashboard');
  }
);

router.get(
  '/facebook',
  ratelimit('pushlimit', 10, '', 1),
  passport.authenticate('facebook', {
    scope: [{ scope: ['email', 'public_profile', 'user_location'] }]
  })
);

router.get(
  '/facebook/callback',
  ratelimit('pushlimit', 10, '', 1),
  passport.authenticate('facebook', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
  })
);

router.get('/twitter',ratelimit('pushlimit', 10, '', 1), passport.authenticate('twitter'));

router.get(
  '/twitter/callback',
  ratelimit('pushlimit', 10, '', 1),
  passport.authenticate('twitter', {
    failureRedirect: '/'
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('index/admin');
  }
);

router.get('/pinterest',ratelimit('pushlimit', 10, '', 1), passport.authenticate('pinterest'));

router.get(
  '/pinterest/callback',
  ratelimit('pushlimit', 10, '', 1),
  passport.authenticate('pinterest', {
    failureRedirect: '/'
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('index/dashboard');
  }
);

router.get('/instagram',ratelimit('pushlimit', 10, '', 1), passport.authenticate('instagram'));

router.get(
  '/instagram/callback',
  ratelimit('pushlimit', 10, '', 1),
  passport.authenticate('instagram', {
    failureRedirect: '/'
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('index/dashboard');
  }
);

// router.get('/verify',ratelimit('pushlimit', 10, '', 1), (req, res) => {
//   if(req.user){
//     console.log(req.user);
//   }else{
//     console.log('Not Auth');
//   }
// });

router.get('/logout',ratelimit('pushlimit', 10, '', 1), (req, res) => {
  req.logout();
  res.redirect('/');
});

router.post('/otplogin',ratelimit('pushlimit', 10, '', 1), authCtrl.LoginWithOtp);

router.post('/verifyotp',ratelimit('pushlimit', 10, '', 1),authCtrl.VerifyWithOtp);

module.exports = router;
