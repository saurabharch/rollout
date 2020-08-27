const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RoleSchema = new Schema(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        autopopulate: { maxDepth: 2 }
      }
    ],
    roleAssigned: {
      type: String
    },
    roleAssigned: {
      type: String,
      lowercase: true,
      enum: {
        values: ["user", "admin", "owner", "creators", "editor"],
        message: "you role is assigned as `{VALUE}`"
      },
      default: "user"
    },
    orgName: {
      type: String,
      lowercase: true
    }
  },
  {
    timestamps: true
  }
);

// Create collection and add schema
const Role = mongoose.model("role", RoleSchema);
// export default Role;
module.exports = Role;
// export const Role = model('role', RoleSchema);
