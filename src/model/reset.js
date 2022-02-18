const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { randomBytes, createHmac, timingSafeEqual } = require('crypto');
const {
  PASSWORD_RESET_BYTES,
  APP_SECRET,
  PASSWORD_RESET_TIMEOUT,
  APP_ORIGIN
} = require('../config/auth');
const passwordResetSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      autopopulate:true
    },
    token: String,
    expiredAt: Date
  },
  {
    timestamps: true,
    versionKey: false
  }
);

passwordResetSchema.plugin(require('mongoose-autopopulate'));
passwordResetSchema.pre('save', function(){
  if(this.isModified('token')){
    this.token = PasswordReset.hashedToken(this.token);
  }
  if(!this.expiredAt){
    this.expiredAt = new Date(new Date().getTime() + PASSWORD_RESET_TIMEOUT);
  }
});
passwordResetSchema.methods.url = function(plaintextToken){
  return `${APP_ORIGIN}/password/reset?id=${this.id}&token=${plaintextToken}`;
};
passwordResetSchema.methods.isValid = function(plaintextToken){
  const hash = PasswordReset.hashedToken(plaintextToken);
  return (
    timingSafeEqual(Buffer.from(hash), Buffer.from(this.token)) &&
    this.expiredAt > new Date()
  );
};
passwordResetSchema.statics.plaintextToken = () => {
  return randomBytes(PASSWORD_RESET_BYTES).toString('hex');
};
passwordResetSchema.statics.hashedToken = plaintextToken => {
  return createHmac('sha256', APP_SECRET).update(plaintextToken).digest('hex');
};

// The same E11000 error can occur when you call `update()`
// This function **must** take 3 parameters. If you use the
// `passRawResult` function, this function **must** take 4
// parameters
passwordResetSchema.post('update', function(error, res, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(); // The `update()` call will still error out.
  }
});


// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
passwordResetSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
});

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);
// export defaul Subscription;
module.exports = PasswordReset;
// export const PasswordReset = model('PasswordReset', passwordResetSchema);
