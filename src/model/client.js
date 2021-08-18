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
});

ClientSchema.plugin(require('mongoose-autopopulate'));
// Export the Mongoose model
const Client = mongoose.model('Client', ClientSchema);
module.exports = Client;
