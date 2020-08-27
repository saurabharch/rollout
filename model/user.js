const mongoose = require("mongoose");
// import { Schema, model } from 'mongoose';
// import { hash, compare } from 'bcryptjs';
const Schema = mongoose.Schema;
// const model = mongoose.model;
const { hash, compare } = require("bcryptjs");
// const hash  = bcrypt.hash();
// const compare = bcrypt.compare();
// const crypto = require("crypto");
// const createHash = "";
// const createHmac = "";
// const timingSafeEqual = crypto.timingSafeEqual();
const {
  BCRYPT_WORK_FACTOR,
  APP_SECRET,
  EMAIL_VERIFICATION_TIMEOUT,
  APP_ORIGIN
} = require("../config/auth");
// const {APP_SECRET} = require("../config/auth");
// const {EMAIL_VERIFICATION_TIMEOUT} = required("../config/auth");
// const {APP_ORIGIN} = require("../config/auth");
const { createHash, createHmac, timingSafeEqual } = require("crypto");
//import { BCRYPT_WORK_FACTOR, APP_SECRET, EMAIL_VERIFICATION_TIMEOUT, APP_ORIGIN } from '../config';
var __rest =
  (this && this.__rest) ||
  function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
const hRandom = numberval => {
  return (numberval = Math.floor(Math.random() * 10000 + 1));
};
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
      validate: [
        async email => !await User.exists({ email }),
        "Email is already taken."
      ]
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
      validate: [
        async username => !await User.exists({ username }),
        "Username is already taken."
      ],
      default: "pguser-" + `${hRandom}`
    },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: false },
    orgName: {
      type: Schema.Types.ObjectId,
      ref: "organization",
      autopopulate: true
    },
    password: String,
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      },
      required: [false, "User phone number not Assigned"]
    },
    firstName: {
      type: String,
      min: 1,
      max: 50
    },
    lastName: {
      type: String,
      min: 1,
      max: 50
    },
    DateofBirth: {
      type: Date
    },
    sex: {
      type: String,
      min: 1,
      max: 1,
      default: "O",
      enum: ["M", "F", "O"]
    },
    image: {
      type: String
    },
    twitterId: {
      type: String,
      unique: true,
      validate: [
        async twitterId => !await User.exists({ twitterId }),
        "Twitter handler is already taken."
      ]
    },
    googlePlus: {
      type: String,
      unique: true,
      validate: [
        async googlePlus => !await User.exists({ googlePlus }),
        "Google handler is already taken."
      ]
    },
    facebookPage: {
      type: String
    },
    facebookId: {
      type: String,
      unique: true,
      validate: [
        async facebookId => !await User.exists({ facebookId }),
        "Facebook handler is already taken."
      ]
    },
    youtubeId: {
      type: String,
      unique: true,
      validate: [
        async youtubeId => !await User.exists({ youtubeId }),
        "Youtube handler is already taken."
      ]
    },
    verifiedAt: Date
  },
  {
    timestamps: true
  }
);
userSchema.pre("save", async function() {
  if (this.isModified("password")) {
    this.password = await hash(this.password, BCRYPT_WORK_FACTOR);
  }
});
userSchema.methods.matchesPassword = function(password) {
  return compare(password, this.password);
};
userSchema.methods.verificationUrl = function() {
  const token = createHash("sha1").update(this.email).digest("hex");
  const expires = Date.now() + EMAIL_VERIFICATION_TIMEOUT;
  const url = `${APP_ORIGIN}/email/verify?id=${this
    .id}&token=${token}&expires=${expires}`;
  const signature = User.signVerificationUrl(url);
  return `${url}&signature=${signature}`;
};
userSchema.statics.signVerificationUrl = url =>
  createHmac("sha256", APP_SECRET).update(url).digest("hex");
userSchema.statics.hasValidVerificationUrl = (path, query) => {
  const url = `${APP_ORIGIN}${path}`;
  const original = url.slice(0, url.lastIndexOf("&"));
  const signature = User.signVerificationUrl(original);
  return (
    timingSafeEqual(Buffer.from(signature), Buffer.from(query.signature)) &&
    +query.expires > Date.now()
  );
};
userSchema.set("toJSON", {
  transform: (doc, _a, options) => {
    var { __v, password } = _a,
      rest = __rest(_a, ["__v", "password"]);
    return rest;
  }
});

const User = mongoose.model("user", userSchema);
module.exports = User;
