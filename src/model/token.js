// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var TokenSchema   = new mongoose.Schema({
  value: { type: String, required: true },
  userId: { type: String, required: true },
  clientId: { type: String, required: true }
},
{
    timestamps: true,
    versionKey: false
});

// Export the Mongoose model
const Token = mongoose.model('Token', TokenSchema);
module.exports = Token;