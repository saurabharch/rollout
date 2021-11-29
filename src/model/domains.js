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

// The same E11000 error can occur when you call `update()`
// This function **must** take 3 parameters. If you use the
// `passRawResult` function, this function **must** take 4
// parameters
DomainNameSchema.post('update', function(error, res, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(); // The `update()` call will still error out.
  }
});


// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
DomainNameSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
});

DomainNameSchema.plugin(require('mongoose-autopopulate'));
DomainNameSchema.plugin(AutoIncrement, {id:'site_seq',inc_field: 'siteId'});
const Domains = mongoose.model('domains', DomainNameSchema);
module.exports = Domains;
// export const Domains = model('domains', DomainNameSchema);
