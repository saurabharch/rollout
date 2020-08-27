const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const hash  = bcrypt.hash();
const compare = bcrypt.compare();
const hRandom = '';
hRandom = numberval =>
{
   return numberval = Math.floor((Math.random() * 10000) + 1);
}  
// Create Shema
const UserSchema = new Schema({
  username: {
    type: String,
    validate: [
            async (username) => !(await User.exists({ username })),
            'Username is already taken.'
        ],
    default: "pguser-" + `${hRandom}`
  },
  role: { type: Schema.Types.ObjectId, ref: "Role", required: false },
  orgName: {
    type: Schema.Types.ObjectId,
    ref: "organization",
    autopopulate: true
  },
  email: {
    type: String,
    unique: true,
    validate: [
            async (email) => !(await User.exists({ email })),
            'Email is already taken.'
        ]
  },
  phone: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  image: {
    type: String
  },
  twitterId: {
    type: String,
    unique: true,
    validate: [
            async (twitterId) => !(await User.exists({ twitterId })),
            'Twitter handler is already taken.'
        ]
  },
  googlePlus: {
    type: String,
    unique: true,
    validate: [
            async (googlePlus) => !(await User.exists({ googlePlus })),
            'Google handler is already taken.'
        ]
  },
  facebookPage: {
    type: String
  },
  facebookId: {
    type: String,
    unique: true,
    validate: [
            async (facebookId) => !(await User.exists({ facebookId })),
            'Facebook handler is already taken.'
        ]
  },
  youtubeId: {
    type: String,
    unique: true,
    validate: [
            async (youtubeId) => !(await User.exists({ youtubeId })),
            'Youtube handler is already taken.'
        ]
  }
},
  {
    timestamps: true
  }
);

UserSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await User.hash(this.password);
    }
});
UserSchema.statics.hash = (password) => hash(password, 10);
UserSchema.methods.matchesPassword = function (password) {
    return compare(password, this.password);
};
// Create collection and add schema
const User = mongoose.model('user', UserSchema);
export default User;