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
});

let SessionModel =  mongoose.model('Session',SessionSchema)
module.exports = SessionModel