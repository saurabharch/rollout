const mongoose = require('mongoose');
 const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const DomainNameSchema = new mongoose.Schema(
  {
    siteUrl: {
      type: String,
      default: 'https://pushgeek.com',
      require: true,
      lowercase: true,
      unique: true
    },
    siteImages: String,
    siteId: Number,
    startTime: {
      type: Date,
      default: Date.now
    },
    setting:{
       type: Schema.Types.ObjectId,
            ref: 'user',
            autopopulate:{maxDepth: 2 }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
DomainNameSchema.plugin(require('mongoose-autopopulate'));
DomainNameSchema.plugin(AutoIncrement, {id:'site_seq',inc_field: 'siteId'});
const Domains = mongoose.model('domains', DomainNameSchema);
module.exports = Domains;
// export const Domains = model('domains', DomainNameSchema);
