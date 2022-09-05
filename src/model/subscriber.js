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
const SubscriberSchema = new mongoose.Schema(
  {
    site_id:{type:Number, default:2,index:true},
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
    pe_ref_url: {type:String},
    ll:Schema.Types.Mixed
    }],
    // browser_info:Schema.Types.Mixed,
    // subscription: Schema.Types.Mixed,
    // subscription:[{
      endpoint: {type:String},
      expirationTime: String,
      keys: Schema.Types.Mixed,
      expirationTime:{
        type:String,
        default: moment(new Date(Date.now()+1000*60*60*24*365*5)).format('lll')//src = src ? src : ''
      },
      project_id: {
       type: Schema.Types.ObjectId,
          ref: 'project',
          autopopulate: true
    },
      vapid_public_key:{
        type:String
      },
      subscription_url: {
        type:String
      },
    // }],
   geo_info:Schema.Types.Mixed,
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

// The same E11000 error can occur when you call `update()`
// This function **must** take 3 parameters. If you use the
// `passRawResult` function, this function **must** take 4
// parameters
SubscriberSchema.post('update', function(error, res, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(); // The `update()` call will still error out.
  }
});


// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
SubscriberSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
});

SubscriberSchema.plugin(require('mongoose-autopopulate'));
const Subscriber = mongoose.model('subscriber', SubscriberSchema);
module.exports = Subscriber;
