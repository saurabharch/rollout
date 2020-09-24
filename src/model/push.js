const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PushMessageSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
      min: 4,
      max: 200,
      default: "Hello World ! This is PushGeek"
    },
    message: {
      type: String,
      require: true,
      min: 4,
      max: 300,
      default: "Hello World ! New Push Message From Push Geek"
    },
    url: {
      type: String,
      require: true,
      min: 4,
      max: 200,
      default: "https://pushgeek.com"
    },
    ttl: {
      type: String,
      default: "3600"
    },
    icon: {
      type: String,
      min: 10,
      max: 600
    },
    image: {
      type: String,
      min: 4,
      max: 600
    },
    badge: {
      type: String
    },
    tag: {
      type: String
      // enum: {
      //   values: ["sports", "entertainment", "engineering"],
      //   message: "by default tag name is `{VALUE}`!"
      // },
      // default: "sports",
      // required: [false, "tag name is not added."]
    },
    actions: {
      type: String,
      enum: {
        values: ["yes", "no", "cancel", "nothing"],
        message: "your action is set as `{VALUE}`"
      },
      default: "cancel",
      required: [false, "action type is set as cancel"]
    },
    requireInteraction: {
      type: Boolean,
      default: false,
      required: [false, "action interation is by default false"]
    },
    vibrate: {
      type: String,
      enum: ["500", "110", "450", "200", "170", "40"],
      default: "500",
      required: [false, "vibration key number default set as 500"]
    },
    silent: {
      type: Boolean
      // enum: {
      //   values: [false, true],
      //   message: "sent notification tone `{VALUE}`."
      // },
      // default: [false, "sent notification without alert tone."]
    },
    renotify: {
      type: Boolean
      // enum: {
      //   values: [true, false],
      //   message: "re-notification alert is `{VALUE}`."
      // },
      // default: [false, "re-notification alert is disabled."]
    },
    sound: {
      type: String,
      default: "/audio/notification.mp3"
    },
    dir: {
      type: String
      // enum: {
      //   values: ["ltr", "rtl", "auto"],
      //   message: "your language direaction is set as `{VALUE}`"
      // },
      // default: "auto",
      // require: [false, "your language direaction is set as by default."]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    urgency: {
      type: String,
      // enum: {
      //   values: ["urgent", "normal", "moderate"],
      //   message: "message broadcast segmented as `{VALUE}`"
      // },
      default: "normal"
    },
    AuthUser: [
      {
        User: {
          type: Schema.Types.ObjectId,
          ref: "user",
          autopopulate: true
        },
        Role: {
          type: Schema.Types.ObjectId,
          ref: "role",
          autopopulate: true
        },
        OrgName: {
          type: Schema.Types.ObjectId,
          ref: "organization",
          autopopulate: true
        }
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Push = mongoose.model("push", PushMessageSchema);
module.exports = Push;
// export const Push = mongoose.model("push", PushMessageSchema);
