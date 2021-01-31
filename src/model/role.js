const mongoose = require('mongoose');
const Schema = mongoose.Schema;
export const ROLES = ['user', 'admin', 'moderator', 'owner', 'superadmin'];
const RoleSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      enum: {
        values: ['user', 'admin', 'owner', 'moderator', 'superadmin'],
        message: 'you role is assigned as `{VALUE}`'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Create collection and add schema
const Role = mongoose.model('Role', RoleSchema);
// export default Role;
module.exports = Role;
// export const Role = model('role', RoleSchema);
