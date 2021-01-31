const mongoose = require('mongoose');
const moment = require("moment");
const Schema = mongoose.Schema;
// create geolocation Schema
const GeoSchema = new Schema({
  type: {
    type: String,
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    index: '2dsphere'
  }
});
const clientSchema = new Schema({

});
const SubscriberSchema = new Schema(
  {
    endpoint: String,
    keys: Schema.Types.Mixed,
    clientData: Schema.Types.Mixed,
    expirationTime:{
      type:String,
      default: moment(new Date(Date.now()+1000*60*60*24*365*5)).format('lll')//src = src ? src : ''
    },
    domain: {
      type: String,
      lowercase: true
    },
    geometry: GeoSchema,
    

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
const Subscriber = mongoose.model('subscriber', SubscriberSchema);
module.exports = Subscriber;
