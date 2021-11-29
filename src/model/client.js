// Load required packages
var mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define our client schema
var ClientSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  id: { type: String, required: true },
  secret: { type: String, required: true },
  userId: { type: String, required: true },
  user:[{
            type: Schema.Types.ObjectId,
            ref: 'user',
            autopopulate: true

  }],
  redirect_uri: {type:String, require:true}
},
{
    timestamps: true,
    versionKey: false
});

// The same E11000 error can occur when you call `update()`
// This function **must** take 3 parameters. If you use the
// `passRawResult` function, this function **must** take 4
// parameters
ClientSchema.post('update', function(error, res, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(); // The `update()` call will still error out.
  }
});


// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
ClientSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
});


ClientSchema.plugin(require('mongoose-autopopulate'));
// Export the Mongoose model
const Client = mongoose.model('Client', ClientSchema);
module.exports = Client;
