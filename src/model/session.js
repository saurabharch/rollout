const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 
const SessionSchema = new Schema({
        _id: { type: Schema.Types.ObjectId, required: true, auto: true, },
        userId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
        validAttempt: { type: Boolean, required: true, default: false },
        ipAddress: { type: String, required: true },
        deviceId: { type: String, required: true },
        deviceToken: { type: String },
        deviceType: {
            type: String, required: true
        },
        // source: { type: String },
        // deviceModel: { type: String },
        appVersion: { type: String, required: true },
        loginStatus: { type: Boolean, required: true, default: true },
        createdAt: { type: Number, required: true },
        updatedAt: { type: Number, required: true }  
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
SessionSchema.post('update', function(error, res, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(); // The `update()` call will still error out.
  }
});


// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
SessionSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
});


let SessionModel =  mongoose.model('Session',SessionSchema)
module.exports = SessionModel