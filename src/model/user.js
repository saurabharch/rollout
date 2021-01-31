const mongoose = require('mongoose');
const Schema = mongoose.Schema;
import { v4 as uuidv4 } from 'uuid';
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const val = require('validator');

const app = require('../config/app');
const auth = require('../config/auth')
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
      sparse:true,
      validate: {
        validator: function(email){
          return async email => !await User.exists({ email });
        },
        message: props => `${props.value} email is already taken.`
      }
      // validate: [
      //   async email => !await User.exists({ email }),
      //   "Email is already taken."
      // ]
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
      sparse:true,
      validate: {
        validator: function(username){
          return async username => !await User.exists({ username });
        },
        message: props => `${props.value} username  is already taken.`
      }
      // validate: [
      //   async username => !await User.exists({ username }),
      //   "Username is already taken."
      // ]
    },
    password: { type: String, default: uuidv4() },
    // active: { type: Boolean, default: true, required: true },
    lastUpdatedBy: { type: String, required: true, default: 'System' },
    lastUpdatedDate: { type: Date, required: true, default: new Date() },
    passwordResetToken: String,
    passwordResetExpiration: Date,
    emailConfirmationToken: { type: String, default: uuidv4() },
    lastIPAddress: String,
    orgName: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      autopopulate: true
    },
    phone: {
      type: String,
      validate: {
        validator: function(v){
          return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      },
      required: [false, 'User phone number not Assigned']
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    DateofBirth: {
      type: Date
    },
    sex: {
      type: String
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role'
      }
    ],
    image: {
      type: String
    },
    sociaID: {
      type: String,
      required: false
    },
    provider: {
      type: String,
      required: false
    },
    twitterId: {
      type: String
      // validate: {
      //   validator: function(twitterId){
      //     return async twitterId => !await User.exists({ twitterId });
      //   },
      //   message: props => `${props.value} Twitter handler is already taken.`
      // }
      // default: ""
      // validate: [
      //   ,
      //   "Twitter handler is already taken."
      // ]
    },
    googlePlus: {
      type: String
      // index: { unique: true },
      // validate: {
      //   validator: function(googlePlus){
      //     return async googlePlus => !await User.exists({ googlePlus });
      //   },
      //   message: props => `${props.value} google handler is already taken.`
      // }
      // validate: [
      //   async googlePlus => !await User.exists({ googlePlus }),
      //   "Google handler is already taken."
      // ]
    },
    facebookPage: {
      type: String
    },
    facebookId: {
      type: String
      // index: { unique: true },
      // validate: {
      //   validator: function(facebookId){
      //     return async facebookId => !await User.exists({ facebookId });
      //   },
      //   message: props => `${props.value} facebook handler is already taken.`
      // },
      //unique: true
      // validate: [
      //   async facebookId => !await User.exists({ facebookId }),
      //   "Facebook handler is already taken."
      // ]
    },
    youtubelink: {
      type: String
      // index: { unique: true },
      // validate: {
      //   validator: function(youtubelink){
      //     return async youtubelink => !await User.exists({ youtubelink });
      //   },
      //   message: props => `${props.value} youtube handler is already taken.`
      // }
      // unique: true
      // validate: [
      //   async youtubelink => !await User.exists({ youtubelink }),
      //   "Youtube handler is already taken."
      // ]
    },
    _parent: Schema.ObjectId
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.pre('save', function(){
  return __awaiter(this, void 0, void 0, function(){
    let _a;
    return __generator(this, function(_b){
      switch(_b.label){
        case 0:
          if(!this.isModified('password'))return [3 /* break */, 2];
          _a = this;
          return [
            4 /* yield */,
            bcryptjs.hash(this.password, auth.BCRYPT_WORK_FACTOR)
          ];
        case 1:
          _a.password = _b.sent();
          _b.label = 2;
        case 2:
          return [2];
      }
    });
  });
});
userSchema.methods.matchesPassword = function(password){
  return bcryptjs.compare(password, this.password);
};
userSchema.methods.verificationUrl = function(){
  const token = crypto.createHash('sha1').update(this.email).digest('hex');
  const expires = Date.now() + auth.EMAIL_VERIFICATION_TIMEOUT;
  const url =
    `${app.APP_ORIGIN
    }/email/verify?id=${
    this.id
    }&token=${
    token
    }&expires=${
    expires}`;
  const signature = User.signVerificationUrl(url);
  return `${url}&signature=${signature}`;
};
userSchema.statics.signVerificationUrl = function(url){
  return crypto.createHmac('sha256', app.APP_SECRET).update(url).digest('hex');
};
userSchema.statics.hasValidVerificationUrl = function(path, query){
  const url = `${app.APP_ORIGIN}${path}`;
  const original = url.slice(0, url.lastIndexOf('&'));
  const signature = User.signVerificationUrl(original);
  return (
    crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(query.signature)
    ) && +query.expires > Date.now()
  );
};
userSchema.set('toJSON', {
  transform: function(doc, _a, options){
    const __v = _a.__v;
      const password = _a.password;
      const rest = (_a, [__v, password]);
    return rest;
  }
});

// mongoose.model("User", userSchema, "User");
// exports.User = mongoose.model("User", userSchema);
const User = mongoose.model('user', userSchema);
module.exports = User;
