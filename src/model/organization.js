const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrgNameSchema = new mongoose.Schema(
  {
    orgName: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      default: 'pushgeek.com'
    },
    orgUrl: {
      type: String,
      default: 'http://pushgeek.com'
    },
    OrgImage: String,
    siteId: {
      type: Number,
      default: 0
    },
    Estd: {
      type: Date,
      default: Date.now
    },
    OrgSize: {
      type: String
    },
    domains: [
      {
        siteUrl: {
          type: Schema.Types.ObjectId,
          ref: 'domains',
          unique: true,
          autopopulate: { maxDepth: 2 }
        }
      }
    ],
    AuthUser: [
      {
        User: {
          type: Schema.Types.ObjectId,
          ref: 'user',
          unique: true,
          autopopulate: true
        },
        rRole: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            unique: true,
            autopopulate: true
          }
        ]
      }
    ],
    projects:[
       {
          type: Schema.Types.ObjectId,
          ref: 'project',
          autopopulate: true
        }]
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
OrgNameSchema.post('update', function(error, res, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(); // The `update()` call will still error out.
  }
});


// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
OrgNameSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
});

OrgNameSchema.plugin(require('mongoose-autopopulate'));
const Organization = mongoose.model('organization', OrgNameSchema);
module.exports = Organization;
// export const Organization = model("organization", OrgNameSchema);
