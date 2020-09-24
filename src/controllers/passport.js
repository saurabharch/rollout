const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const PinterestStrategy = require("passport-pinterest").Strategy;
const InstagramStrategy = require("passport-instagram").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");
// Load user model
const User = mongoose.model("user");

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "/auth/google/callback",
        proxy: true
      },
      (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken);
        // console.log(profile);

        const image = profile.photos[0].value.substring(
          0,
          profile.photos[0].value.indexOf("?")
        );

        const newUser = {
          sociaID: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          provider: "google",
          image: image
        };

        // Check for existing user
        User.findOne({
          sociaID: profile.id
        }).then(user => {
          if (user) {
            // Return user
            done(null, user);
          } else {
            // Create user
            new User(newUser).save().then(user => done(null, user));
          }
        });
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: keys.clientID,
        clientSecret: keys.clientSecret,
        callbackURL: "/auth/facebook/callback",
        profileFields: ["id", "displayName", "photos", "email", "familyName"]
      },
      (accessToken, refreshToken, profile, done) => {
        const image = profile.picture.data.url;
        const newUser = {
          sociaID: profile.id,
          firstName: profile.displayName,
          lastName: profile.familyName,
          email: profile.email,
          provider: "facebook",
          image: image
        };
        // Check for existing user
        User.findOne({
          sociaID: profile.id
        }).then(user => {
          if (user) {
            // Return user
            done(null, user);
          } else {
            // Create user
            new User(newUser).save().then(user => done(null, user));
          }
        });
      }
    )
  );

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: keys.ConsumerKey,
        consumerSecret: keys.ConsumerSecret,
        callbackURL: "/auth/twitter/callback"
      },
      function(token, tokenSecret, profile, done) {
        // console.log(profile);
        const image = profile.profile_image_url;
        const newUser = {
          sociaID: profile.id,
          firstName: profile.displayName,
          email: profile.email,
          provider: "twitter",
          image: image
        };
        User.findOne({
          sociaID: profile.id
        }).then(user => {
          if (user) {
            // Return user
            done(null, user);
          } else {
            // Create user
            new User(newUser).save().then(user => done(null, user));
          }
        });
      }
    )
  );

  passport.use(
    new PinterestStrategy(
      {
        clientID: keys.AppID,
        clientSecret: keys.AppSecret,
        scope: ["read_public", "read_relationships"],
        callbackURL: "/auth/pinterest/callback",
        state: true
      },
      function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        const image = profile.photos[0].value;
        const newUser = {
          sociaID: profile.id,
          firstName: profile.displayName,
          email: profile.email,
          provider: "pinterest",
          image: image
        };
        User.findOne({
          sociaID: profile.id
        }).then(user => {
          if (user) {
            // Return user
            done(null, user);
          } else {
            // Create user
            new User(newUser).save().then(user => done(null, user));
          }
        });
      }
    )
  );

  passport.use(
    new InstagramStrategy(
      {
        clientID: keys.InstaId,
        clientSecret: keys.InstaSecret,
        callbackURL: "/auth/instagram/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        const image = profile._json.data.profile_picture;
        const newUser = {
          sociaID: profile.id,
          firstName: profile.displayName,
          email: profile.email,
          provider: profile.provider,
          image: image
        };
        User.findOne({
          sociaID: profile.id
        }).then(user => {
          if (user) {
            // Return user
            done(null, user);
          } else {
            // Create user
            new User(newUser).save().then(user => done(null, user));
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
};
