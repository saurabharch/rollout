
import{ isLoggedIn, logOut }from'../auth';
import{ BadRequest, Unauthorized }from'../errors';
import{ SESSION_ABSOLUTE_TIMEOUT }from'../config';
import{ catchAsync }from'./errors';
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var DigestStrategy = require('passport-http').DigestStrategy;
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
export const guest = (req, res, next) => {
  if(isLoggedIn(req)){
    return next(new BadRequest('You are already logged in'));
  }

  next();
};

export const auth = (req, res, next) => {
  if(!isLoggedIn(req)){
    return next(new Unauthorized('You must be logged in'));
  }

  next();
};

export const active = catchAsync(async (req, res, next) => {
  if(isLoggedIn(req)){
    const now = Date.now();
    const { createdAt } = req.session;

    if(now > createdAt + SESSION_ABSOLUTE_TIMEOUT){
      await logOut(req, res);

      return next(new Unauthorized('Session expired'));
    }
  }

  next();
});

passport.use(new BasicStrategy(
  function(username, password, callback) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));

passport.use(new DigestStrategy(
  { algorithm: 'MD5', qop: 'auth' },
  function(username, callback) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Success
      return callback(null, user, user.password);
    });
  },
  function(params, callback) {
    // validate nonces as necessary
    callback(null, true);
  }
));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pass'
  },
  function(username, password, callback) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));

passport.use('client-basic', new BasicStrategy(
  function(username, password, callback) {
    Client.findOne({ id: username }, function (err, client) {
      if (err) { return callback(err); }

      // No client found with that id or bad password
      if (!client || client.secret !== password) { return callback(null, false); }

      // Success
      return callback(null, client);
    });
  }
));

passport.use(new BearerStrategy(
  function(accessToken, callback) {
    Token.findOne({value: accessToken }, function (err, token) {
      if (err) { return callback(err); }

      // No token found
      if (!token) { return callback(null, false); }

      User.findOne({ _id: token.userId }, function (err, user) {
        if (err) { return callback(err); }

        // No user found
        if (!user) { return callback(null, false); }

        // Simple example with no scope
        callback(null, user, { scope: '*' });
      });
    });
  }
));
export const isAuthenticated = passport.authenticate(['local', 'bearer'], { session : false });
export const isClientAuthenticated = passport.authenticate('client-basic', { session : false });
export const isBearerAuthenticated = passport.authenticate('bearer', { session: false });