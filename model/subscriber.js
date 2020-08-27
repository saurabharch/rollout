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
    timestamps: true
  }
);
// const modelname = 'subscribers';
const Subscription = mongoose.model("subscribers", SubscriberSchema);
// export defaul Subscription;
module.exports = Subscription;

// module.exports = mongoose.model("subscribers", SubscriberSchema);
