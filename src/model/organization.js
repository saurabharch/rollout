const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OrgNameSchema = new Schema(
  {
    orgName: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      default: "pushgeek.com"
    },
    orgUrl: {
      type: String,
      default: "http://pushgeek.com"
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
          ref: "domains",
          unique: true,
          autopopulate: { maxDepth: 2 }
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
        rRole: {
          type: Schema.Types.ObjectId,
          ref: "Role",
          unique: true,
          autopopulate: true
        }
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Organization = mongoose.model("organization", OrgNameSchema);
module.exports = Organization;
// export const Organization = model("organization", OrgNameSchema);
