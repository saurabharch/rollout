const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const urlPattern = /(http|https):\/\/(\w+:{0,1}\w*#)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%#!\-/]))?/;
const urlRegExp = new RegExp(urlPattern);
const moment = require("moment");
const PushMessageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      min: 4,
      max: 200,
      default: 'Hello World ! This is PushGeek',
      index:true
    },
    message: {
      type: String,
      require: true,
      min: 4,
      max: 300,
      default: 'Hello World ! New Push Message From Push Geek'
    },
    url:  {
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
    ttl: {
      type: String,
      default: '3600'
    },
    icon:  {
      type: String,
      validate: {
        validator: function(value) {
          return value.match(urlRegExp);
        },
        message: props => `${props.value} is not a valid URL`
      },
      lowercase: true,
    },
    image:  {
      type: String,
      validate: {
        validator: function(value) {
          return value.match(urlRegExp);
        },
        message: props => `${props.value} is not a valid URL`
      },
      lowercase: true,
    },
    badge:  {
      type: String,
      validate: {
        validator: function(value) {
          return value.match(urlRegExp);
        },
        message: props => `${props.value} is not a valid URL`
      },
      lowercase: true,
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
        values: ['yes', 'no', 'cancel', 'nothing'],
        message: 'your action is set as `{VALUE}`'
      },
      default: 'yes',
      required: [false, 'action type is set as {VALUE}']
    },
    requireInteraction: {
      type: Boolean,
      default: false,
      required: [false, 'action interation is by default false']
    },
    vibrate: {
      type: String,
      // enum: ['500', '110', '450', '200', '170', '40'],
      default: '100',
      required: [false, 'vibration key number default set as 100']
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
    sound:  {
      type: String,
      validate: {
        validator: function(value) {
          return value.match(urlRegExp);
        },
        message: props => `${props.value} is not a valid URL`
      },
      lowercase: true,
      default: 'http://localhost:5500/audio/notification.mp3'
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
      type: String,
      default: moment(new Date(Date.now())).format('lll')
    },
    urgency: {
      type: String,
      // enum: {
      //   values: ["urgent", "normal", "moderate"],
      //   message: "message broadcast segmented as `{VALUE}`"
      // },
      default: 'normal'
    },
    setting:{
      type:Schema.Types.ObjectId,
      ref:'pushsetting',
      autopopulate: true
    },
    // setting:[
    //   {
    //    type: Schema.Types.ObjectId,
    //         ref: 'user',
    //         autopopulate: true
    // }
    // ],
     project_id:{
          type: Schema.Types.ObjectId,
          ref: 'project',
          autopopulate: true
    }
   
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// The same E11000 error can occur when you call `update()`
// This function **must** take 3 parameters. If you use the
// `passRawResult` function, this function **must** take 4
// parameters
PushMessageSchema.post('update', function(error, res, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(); // The `update()` call will still error out.
  }
});


// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
PushMessageSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
});
PushMessageSchema.plugin(require('mongoose-autopopulate'));
const Push = mongoose.model('push', PushMessageSchema);
module.exports = Push;
// export const Push = mongoose.model("push", PushMessageSchema);
