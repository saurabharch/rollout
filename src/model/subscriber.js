const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SubscriberSchema = new Schema(
  {
    endpoint: String,
    keys: Schema.Types.Mixed,
    createDate: {
      type: Date,
      default: Date.now
    },
    domain: {
      type: String,
      lowercase: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
// const modelname = 'subscribers';
// const Subscription = mongoose.model(
//   "subscribers",
//   SubscriberSchema,
//   "subscribers"
// );
// // export defaul Subscription;
// module.exports = Subscription;

// mongoose.model("subscriber", SubscriberSchema, "subscriber");
// // module.exports = mongoose.model("subscribers", SubscriberSchema);
const Subscriber = mongoose.model("subscriber", SubscriberSchema);
module.exports = Subscriber;
