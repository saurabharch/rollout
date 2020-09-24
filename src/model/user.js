var mongoose = require("mongoose");
const Schema = mongoose.Schema;
var uuid = require("node-uuid");
var bcryptjs = require("bcryptjs");
var crypto = require("crypto");
var val = require("validator");

var auth = require("../config/auth");
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
      ]
    },
    password: { type: String, required: true },
    // active: { type: Boolean, default: true, required: true },
    lastUpdatedBy: { type: String, required: true, default: "System" },
    lastUpdatedDate: { type: Date, required: true, default: new Date() },
    passwordResetToken: String,
    passwordResetExpiration: Date,
    emailConfirmationToken: { type: String, default: uuid() },
    lastIPAddress: String,
    orgName: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      autopopulate: true
    },
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
        ref: "Role"
      }
    ],
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
    youtubelink: {
      type: String,
      unique: true,
      validate: [
        async youtubelink => !await User.exists({ youtubelink }),
        "Youtube handler is already taken."
      ]
    },
    _parent: Schema.ObjectId
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.pre("save", function() {
  return __awaiter(this, void 0, void 0, function() {
    var _a;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          if (!this.isModified("password")) return [3 /*break*/, 2];
          _a = this;
          return [
            4 /*yield*/,
            bcryptjs.hash(this.password, auth.BCRYPT_WORK_FACTOR)
          ];
        case 1:
          _a.password = _b.sent();
          _b.label = 2;
        case 2:
          return [2 /*return*/];
      }
    });
  });
});
userSchema.methods.matchesPassword = function(password) {
  return bcryptjs.compare(password, this.password);
};
userSchema.methods.verificationUrl = function() {
  var token = crypto.createHash("sha1").update(this.email).digest("hex");
  var expires = Date.now() + auth.EMAIL_VERIFICATION_TIMEOUT;
  var url =
    auth.APP_ORIGIN +
    "/email/verify?id=" +
    this.id +
    "&token=" +
    token +
    "&expires=" +
    expires;
  var signature = exports.User.signVerificationUrl(url);
  return url + "&signature=" + signature;
};
userSchema.statics.signVerificationUrl = function(url) {
  return crypto.createHmac("sha256", auth.APP_SECRET).update(url).digest("hex");
};
userSchema.statics.hasValidVerificationUrl = function(path, query) {
  var url = "" + auth.APP_ORIGIN + path;
  var original = url.slice(0, url.lastIndexOf("&"));
  var signature = exports.User.signVerificationUrl(original);
  return (
    crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(query.signature)
    ) && +query.expires > Date.now()
  );
};
userSchema.set("toJSON", {
  transform: function(doc, _a, options) {
    var __v = _a.__v,
      password = _a.password,
      rest = __rest(_a, ["__v", "password"]);
    return rest;
  }
});

// mongoose.model("User", userSchema, "User");
// exports.User = mongoose.model("User", userSchema);
const User = mongoose.model("user", userSchema);
module.exports = User;
