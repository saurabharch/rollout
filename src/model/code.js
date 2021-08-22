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

// Export the Mongoose model
CodeSchema.plugin(require('mongoose-autopopulate'));
const Code = mongoose.model('Code', CodeSchema);
module.exports = Code;