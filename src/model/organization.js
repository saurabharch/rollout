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
OrgNameSchema.plugin(require('mongoose-autopopulate'));
const Organization = mongoose.model('organization', OrgNameSchema);
module.exports = Organization;
// export const Organization = model("organization", OrgNameSchema);
