const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const PinterestStrategy = require('passport-pinterest').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var DigestStrategy = require('passport-http').DigestStrategy;
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
const mongoose = require('mongoose');
var passport = require('passport');
const keys = require('../config/keys');
// Load user model
const User = mongoose.model('user');
import Role from "../model/role";
const colors = require("colors");
var Client = require('../model/client');
var Token = require('../model/token');
import{ logIn }from'../auth';
import{ sendMail }from'../mail';


module.exports = function(passport){
  //Auth With Google
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
      },
     async (accessToken, refreshToken, profile, done) => {
        console.log(accessToken);
        console.log(profile);

        const image = profile.photos[0].value.substring(
          0,
          profile.photos[0].value.indexOf('?')
        );
        const username = profile.emails[0].value.split('@')[0];
        const Roles = await Role.find({ name: ["user"] });
        console.log( `username: ${username}`)
        const newUser = {
          roles: Roles,
          email: profile.emails[0].value,
          username: username,
          sociaID: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          provider: 'google',
          image: image

        };
        
        // Check for existing user
        User.findOne({
          //sociaID: profile.id,
          email:profile.emails[0].value
          //username:username
        }).then(async user => {
          const sliceUsername = username;
          const Femail =  profile.emails[0].value;
          const userFound =  await User.exists({Femail});
          const username1 = userFound ? `${sliceUsername}`+ Math.floor( Math.random() * (1000000) + 1): username;
          if(user){
            // Return user

           if(!user.username)
           {
             console.log(`User is exist but username is not defined with email : ${user.email}`)
           }
            if(userFound && user.username == null){
                const fEmail = {email: `${profile.emails[0].value}`};
                const userUp = {username: `${username1}`}
                await User.findOneAndUpdate(fEmail,userUp ,{
                  new: true
            });        
              
            done(null, user);
            //console.log(`User is already Registered : ${user}`)
          
          }
        }else{
            console.log(`Registered Users Details : #${newUser}`)
            // Create user

            const user = await (await User.create({newUser})).save().then(async usernam => {
              //logIn(req, user.id);
              //const link = usernam.verificationUrl();
             // console.log(colors.yellow(`Verification Url : ${link}`))
             try{
              await sendMail({
                to: newUser.email,
                subject: 'Pushgeek Verify email address',
                text: `Your are succefully registered on pushgeek please visit Here ${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/login`
              });
             }
             catch(err){
               console.log(colors.red(`Error : ${err.message}`))
             }
              done(null,usernam);
            });
           
           await new User(newUser).save().then(user => done(null, user));
            
           

          }
        });
      }
    )
  );
//Auth with Facebook
  passport.use(
    new FacebookStrategy(
      {
        clientID: keys.clientID,
        clientSecret: keys.clientSecret,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'email', 'familyName']
      },
      (accessToken, refreshToken, profile, done) => {
        const image = profile.picture.data.url;
        const newUser = {
          sociaID: profile.id,
          firstName: profile.displayName,
          lastName: profile.familyName,
          email: profile.email,
          provider: 'facebook',
          image: image
        };
        // Check for existing user
        User.findOne({
          email: profile.email
        }).then(user => {
          if(user){
            // Return user
            done(null, user);
          }else{
            // Create user
            new User(newUser).save().then(user => done(null, user));
          }
        });
      }
    )
  );
//Auth with Twitter
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: keys.ConsumerKey,
        consumerSecret: keys.ConsumerSecret,
        callbackURL: '/auth/twitter/callback'
      },
      (token, tokenSecret, profile, done) => {
        // console.log(profile);
        const image = profile.profile_image_url;
        const newUser = {
          sociaID: profile.id,
          firstName: profile.displayName,
          email: profile.email,
          provider: 'twitter',
          image: image
        };
        User.findOne({
          email: profile.email
        }).then(user => {
          if(user){
            // Return user
            done(null, user);
          }else{
            // Create user
            new User(newUser).save().then(user => done(null, user));
          }
        });
      }
    )
  );
//Auth with Pintrest
  passport.use(
    new PinterestStrategy(
      {
        clientID: keys.AppID,
        clientSecret: keys.AppSecret,
        scope: ['read_public', 'read_relationships'],
        callbackURL: '/auth/pinterest/callback',
        state: true
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        const image = profile.photos[0].value;
        const newUser = {
          sociaID: profile.id,
          firstName: profile.displayName,
          email: profile.email,
          provider: 'pinterest',
          image: image
        };
        User.findOne({
          sociaID: profile.id
        }).then(user => {
          if(user){
            // Return user
            done(null, user);
          }else{
            // Create user
            new User(newUser).save().then(user => done(null, user));
          }
        });
      }
    )
  );
// Auth Instagram
  passport.use(
    new InstagramStrategy(
      {
        clientID: keys.InstaId,
        clientSecret: keys.InstaSecret,
        callbackURL: '/auth/instagram/callback'
      },
      (accessToken, refreshToken, profile, done) => {
        const image = profile._json.data.profile_picture;
        const newUser = {
          sociaID: profile.id,
          firstName: profile.displayName,
          email: profile.email,
          provider: profile.provider,
          image: image
        };
        User.findOne({
          email: profile.email
        }).then(user => {
          if(user){
            // Return user
            done(null, user);
          }else{
            // Create user
            new User(newUser).save().then(user => done(null, user));
          }
        });
      }
    )
  );
// JWT Auth
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
 
// Basic Authentication
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
// Local Auth Stretegy
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
// Client Auth basic
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

};
