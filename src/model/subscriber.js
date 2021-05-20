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
const SubscriberSchema = new mongoose.Schema(
  {
    site_id:{type:Number, default:2},
    browser_info: [{
    device_type: {type:String},
    browser_version: {type:String},
    user_agent: {type:String},
    language: {type:String},
    total_scr_width_height:{type:String},
    available_scr_width_height: {type:String},
    colour_resolution: {type:Number},
    host: {type:String},
    device: {type:String},
    pe_ref_url: {type:String}
    }],
    // browser_info:Schema.Types.Mixed,
    // subscription: Schema.Types.Mixed,
    subscription:[{
      endpoint: String,
      expirationTime: String,
      keys: Schema.Types.Mixed,
      expirationTime:{
        type:String,
        default: moment(new Date(Date.now()+1000*60*60*24*365*5)).format('lll')//src = src ? src : ''
      },
      project_id: {
        type:String
      },
      vapid_public_key:{
        type:String
      },
      subscription_url: {
        type:String
      },
    }],
   geo_info:[{
     geobytestimezone: {type:String}, data:[{type:String}]
   }],
    token_refresh: { type:Boolean, default:false},
    optin_type: {type:Number}
    // geometry: GeoSchema,
    

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
