const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create geolocation Schema
const GeoSchema = new Schema({
  type: {
    type: String,
    default: "Point"
  },
  coordinates: {
    type: [Number],
    index: "2dsphere"
  }
});

const SubscriberSchema = new Schema(
  {
    domain: {
      type: String,
      lowercase: true
    },
    endpoint: String,
    keys: Schema.Types.Mixed,
    geometry: GeoSchema,
    createDate: {
      type: Date,
      default: Date.now
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
