var mongoose = require("./db-connect"),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  uuid = require("node-uuid"),
  Validator = require("validator").Validator,
  val = new Validator();
Validator.prototype.error = function(msg) {
  return false;
};
import { hash, compare } from "bcryptjs";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import {
  BCRYPT_WORK_FACTOR,
  APP_SECRET,
  EMAIL_VERIFICATION_TIMEOUT,
  APP_ORIGIN
} from "../config/auth";

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
    passwordHash: { type: String, required: true },
    active: { type: Boolean, default: true, required: true },
    lastUpdatedBy: { type: String, required: true, default: "System" },
    lastUpdatedDate: { type: Date, required: true, default: new Date() },
    passwordResetToken: String,
    passwordResetExpiration: Date,
    emailConfirmationToken: { type: String, default: uuid() },
    lastIPAddress: String,
    orgName: {
      type: Schema.Types.ObjectId,
      ref: "organization",
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

userSchema
  .virtual("password")
  .get(function() {
    return this._password;
  })
  .set(function(value) {
    this._password = value;
    var salt = bcrypt.gen_salt_sync(12);
    this.passwordHash = bcrypt.encrypt_sync(value, salt);
  });

userSchema
  .virtual("passwordConfirmation")
  .get(function() {
    return this._passwordConfirmation;
  })
  .set(function(value) {
    this._passwordConfirmation = value;
  });

userSchema.path("passwordHash").validate(function(v) {
  if (this._password || this._passwordConfirmation) {
    if (!val.check(this._password).min(6)) {
      this.invalidate("password", "must be at least 6 characters.");
    }
    if (this._password !== this._passwordConfirmation) {
      this.invalidate("passwordConfirmation", "must match confirmation.");
    }
  }

  if (this.isNew && !this._password) {
    this.invalidate("password", "required");
  }
}, null);

userSchema.path("firstName").validate(function(v) {
  if (!val.check(v).max(100)) {
    this.invalidate("firstName", "must be less than 100 characters");
  }
}, null);

userSchema.path("lastName").validate(function(v) {
  if (!val.check(v).max(100)) {
    this.invalidate("lastName", "must be less than 100 characters");
  }
}, null);

userSchema.path("emailAddress").validate(function(v) {
  if (!val.check(v).isEmail()) {
    this.invalidate("emailAddress", "must be a valid email address");
  }
}, null);

userSchema.methods.verificationUrl = function() {
  const token = createHash("sha1").update(this.email).digest("hex");
  const expires = Date.now() + EMAIL_VERIFICATION_TIMEOUT;

  const url = `${APP_ORIGIN}/email/verify?id=${this
    .id}&token=${token}&expires=${expires}`;
  const signature = User.signVerificationUrl(url);

  return `${url}&signature=${signature}`;
};

userSchema.statics.signVerificationUrl = (url: string) =>
  createHmac("sha256", APP_SECRET).update(url).digest("hex");

userSchema.statics.hasValidVerificationUrl = (path: string, query: any) => {
  const url = `${APP_ORIGIN}${path}`;
  const original = url.slice(0, url.lastIndexOf("&"));
  const signature = User.signVerificationUrl(original);

  return (
    timingSafeEqual(Buffer.from(signature), Buffer.from(query.signature)) &&
    +query.expires > Date.now()
  );
};

userSchema.set("toJSON", {
  transform: (doc, { __v, password, ...rest }, options) => rest
});

const User = mongoose.model("user", UserSchema);
export default User;
