// Load required packages
var mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define our token schema
var ProjectSchema   = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String},
  tag: { type: String},
  category:{type:String},
  settings:[
    {
        setting:{
            type: Schema.Types.ObjectId,
            ref: 'pushsetting',
            autopopulate: true
    },
    users:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        autopopulate: true
    }
    }
  ],
 subscriber:[{
     type: Schema.Types.ObjectId,
     ref: 'subscriber',
     autopopulate: true
 }],
  ProjectId: { type: String, required: true }
});

// Export the Mongoose model
ProjectSchema.plugin(require('mongoose-autopopulate'));
const Project = mongoose.model('project', ProjectSchema);
module.exports = Project;