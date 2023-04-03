const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const val = require('validator');
const ObjectId = Schema.ObjectId;
let constantStatus = require("./../util/constants");
const app = require('../../config/app');
const auth = require('../../config/auth')
const urlPattern = /(http|https):\/\/(\w+:{0,1}\w*#)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%#!\-/]))?/;
const urlRegExp = new RegExp(urlPattern);
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
      sparse:true,
      match: [emailRegex, "Please enter a valid email address"],
      trim: true,
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
    active: { type: Boolean, default: false},
    verifiedAt: { type: Date },
    status: { type: Number, default: constantStatus.userStatus.ACTIVE }, // 1 -> active, 2 -> block, 3 -> deleted
    lastUpdatedBy: { type: String, required: true, default: 'System' },
    lastUpdatedDate: { type: Date, required: true, default: new Date() },
    authentication: {
      password: { type: String, required: true, select: false, default: uuidv4()},
      salt: { type: String, select: false },
      sessionToken: { type: String, select: false },
    },
    passwordResetToken: {type:String},
    passwordResetExpiration: Date,
    emailConfirmationToken: { type: String, default: uuidv4() },
    lastIPAddress: {type:String},
    loginTime: { type: Number },
    isLogin: { type: Boolean, default: true, required: true },
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
        ref: 'Role',
        autopopulate:true
      }
    ],
    image:  {
      type: String,
      validate: {
        validator: function(value) {
          return value.match(urlRegExp);
        },
        message: props => `${props.value} is not a valid URL`
      },
      default: 'https://pushgeek.com',
      lowercase: true,
    },
    OrgImage: {
      type: String,
      validate: {
        validator: function(value) {
          return value.match(urlRegExp);
        },
        message: props => `${props.value} is not a valid URL`
      },
      lowercase: true,
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
    youtubelink:  {
      type:String,
      type: String,
      validate: {
        validator: function(value) {
          return value.match(urlRegExp);
        },
        message: props => `${props.value} is not a valid URL`
      },
      default: 'https://pushgeek.com',
      lowercase: true,
    },
    OrgImage: {
      type: String,
      validate: {
        validator: function(value) {
          return value.match(urlRegExp);
        },
        message: props => `${props.value} is not a valid URL`
      },
      lowercase: true,
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
    project_id:[{
      type: Schema.Types.ObjectId,
          ref: 'project',
          autopopulate: true
    }],
    _parent: Schema.ObjectId
  },
  {
    timestamps: true,
    versionKey: false
  }
);
UserSchema.plugin(require('mongoose-autopopulate'));
// userSchema.pre('save', async function(next){
//  bcryptjs.hash(this.password, auth.BCRYPT_WORK_FACTOR, (error, hash) => {
//     if (error) {
//       return next(error);
//     } else {
//       this.password = hash;
//       this.confirmPassword = hash;
//       next();
//     }
//   });
// });
UserSchema.virtual('link').get(function () {
    return this.username + '.' + process.env.DOMAIN;
});

UserSchema.pre("save", function (next) {
  const user = this

  if (this.isModified("password") || this.isNew) {
    bcryptjs.genSalt(auth.BCRYPT_WORK_FACTOR, function (saltError, salt) {
      if (saltError) {
        return next(saltError)
      } else {
        bcryptjs.hash(user.password, salt, function(hashError, hash) {
          if (hashError) {
            return next(hashError)
          }

          user.password = hash
          next()
        })
      }
    })
  } else {
    return next()
  }
})

// userSchema.methods.matchesPassword = function(password){
//   return bcryptjs.compare(password, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };


// The same E11000 error can occur when you call `update()`
// This function **must** take 3 parameters. If you use the
// `passRawResult` function, this function **must** take 4
// parameters
UserSchema.post('update', function(error, res, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(); // The `update()` call will still error out.
  }
});


// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
UserSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
});

UserSchema.methods.comparePassword = function(password, callback) {
  bcryptjs.compare(password, this.password, function(error, isMatch) {
    if (error) {
      return callback(error)
    } else if(isMatch && !User.email){
       return done(null, false, {message: "Please confirm your email first!"});
    }else if(isMatch && User.email){
       return done(null, user);
    }
    else {
      return done(null, false, {message: "Invalid password"});
      //return callback(null, isMatch)
    }
  })
}

UserSchema.methods.verificationUrl = function(){
  const token = crypto.createHash('sha1').update(this.email).digest('hex');
  console.log(`email token: ${this.email}`);
  const expires = Date.now() + auth.EMAIL_VERIFICATION_TIMEOUT;
  console.log(`APP ORIGIN FOR VERIFICATION URL :${app.APP_ORIGIN}`)
  const url =
    `${app.APP_ORIGIN
    }/verify?id=${
    this.id
    }&token=${
    token
    }&expires=${expires}`;
  const signature = User.signVerificationUrl(url);
  console.log(`email verifcation token: ${token}\nemail expires at: ${expires}`);
  console.log(`email verification signature: ${signature}`);
  console.log(`verification url: ${url}&signature=${signature}`);
  return `${url}&signature=${signature}`;
};
UserSchema.statics.signVerificationUrl = function(url){
  return crypto.createHmac('sha256', app.APP_SECRET).update(url).digest('hex');
};

UserSchema.statics.hasValidVerificationUrl = function(path, query){
  try{
    const url = `${app.APP_ORIGIN}${path}`;
  const original = url.slice(0, url.lastIndexOf('&'));
  const signature = User.signVerificationUrl(original);
  return (
    crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(query.signature)
    ) && +query.expires > Date.now()
  );
  }catch{
    return `Invalid Link path`;
  }
};

UserSchema.set('toJSON', {
  transform: function(doc, _a, options){
    const __v = _a.__v;
      const password = _a.password;
      const rest = (_a, [__v, password]);
    return rest;
  }
});

// mongoose.model("User", userSchema, "User");
// exports.User = mongoose.model("User", userSchema);



const User = mongoose.model('user', UserSchema);
module.exports = User;

// User Actions
//export const getUsers = () => UserModel.find();
//export const getUserByEmail = (email: string) => UserModel.findOne({ email });
//export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });
//export const getUserById = (id: string) => UserModel.findById(id);
//export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
//export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
//export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);
