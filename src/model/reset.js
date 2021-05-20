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


const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);
// export defaul Subscription;
module.exports = PasswordReset;
// export const PasswordReset = model('PasswordReset', passwordResetSchema);
