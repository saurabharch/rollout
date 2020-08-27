const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrgNameSchema = new Schema({
  orgName: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    default: "pushgeek-default"
  },
  orgUrl: {
    type: String,
    default: ""
  },
  OrgImage: String,
  siteId: Number,
  Estd: {
    type: Date,
    default: Date.now
  },
  CreateDate: {
    type: Date,
    default: Date.now
  },
  OrgSize: {
    type: String
  },
  domains: [
    {
      domain: {
        type: Schema.Types.ObjectId,
        ref: "domains",
        unique: true,
        autopopulate: true
      },
      dateTime: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  AuthUser: [
    {
      User: {
        type: Schema.Types.ObjectId,
        ref: "user",
        unique: true,
        autopopulate: true
      },
      Role: {
        type: Schema.Types.ObjectId,
        ref: "role",
        unique: true,
        autopopulate: true
      }
    }
  ]
});

const Organization = mongoose.model("organization", OrgNameSchema);
module.exports = Organization;
// export const Organization = model("organization", OrgNameSchema);
