import { Schema, model, Document, Model } from "mongoose";
import { hash, compare } from "bcryptjs";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import {
  BCRYPT_WORK_FACTOR,
  APP_SECRET,
  EMAIL_VERIFICATION_TIMEOUT,
  APP_ORIGIN
} from "../config/auth";

export interface UserDocument extends Document {
  email: string;
  name: string;
  password: string;
  verifiedAt: Date;
  matchesPassword: (password: string) => Promise<boolean>;
  verificationUrl: () => string;
}

interface UserModel extends Model<UserDocument> {
  signVerificationUrl: (url: string) => string;
  hasValidVerificationUrl: (path: string, query: any) => boolean;
}

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
      default: ""
    },
    orgName: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
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
    verifiedAt: Date
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.pre<UserDocument>("save", async function() {
  if (this.isModified("password")) {
    this.password = await hash(this.password, BCRYPT_WORK_FACTOR);
  }
});

userSchema.methods.matchesPassword = function(password: string) {
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

export const User = model<UserDocument, UserModel>("User", userSchema);
