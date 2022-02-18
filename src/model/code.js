// Load required packages
var mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define our token schema
var CodeSchema   = new mongoose.Schema({
  value: { type: String, required: true },
  redirectUri: { type: String, required: true },
  userId: { type: String, required: true },
  user:[
    {
            type: Schema.Types.ObjectId,
            ref: 'user',
            autopopulate: true
    }
  ],
  clientId: { type: String, required: true } 
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
CodeSchema.post('update', function(error, res, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(); // The `update()` call will still error out.
  }
});


// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
CodeSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
});


// Export the Mongoose model
CodeSchema.plugin(require('mongoose-autopopulate'));
const Code = mongoose.model('Code', CodeSchema);
module.exports = Code;