// Load required packages
var mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define our token schema
var ProjectSchema   = new mongoose.Schema({
  title: { type: String, required: true},
  projectId: { type: String, required: true, unique:true,index:true },
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
//  subscriber:[{
//      type: Schema.Types.ObjectId,
//      ref: 'subscriber',
//      autopopulate: true
//  }],
},
{
    timestamps: true,
    versionKey: false
});

// The same E11000 error can occur when you call `update()`
// This function **must** take 3 parameters. If you use the
// `passRawResult` function, this function **must** take 4
// parameters
ProjectSchema.post('update', function(error, res, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(); // The `update()` call will still error out.
  }
});


// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
ProjectSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
});

// Export the Mongoose model
ProjectSchema.plugin(require('mongoose-autopopulate'));
const Project = mongoose.model('project', ProjectSchema);
module.exports = Project;