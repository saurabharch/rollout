const mongoose = require('mongoose');
const Schema = mongoose.Schema;
export const ROLES = ['user','guest','teammate', 'admin','supervisor', 'owner', 'moderator', 'superadmin'];
const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      enum: {
        values: ['user','guest','teammate', 'admin','supervisor', 'owner', 'moderator', 'superadmin'],
        message: 'you role is assigned as `{VALUE}`'
      }
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
RoleSchema.post('update', function(error, res, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(); // The `update()` call will still error out.
  }
});


// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
RoleSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
});

// Create collection and add schema
const Role = mongoose.model('Role', RoleSchema);
// export default Role;
module.exports = Role;
// export const Role = model('role', RoleSchema);
