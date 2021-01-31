import Role from "../model/role";
import User from "../model/user";
import Organisation from "../model/organization";
import Domain from "../model/domains";
// const mongoose = require("mongoose");
// const User = mongoose.model("user");

import bcrypt from "bcryptjs";

export const createRoles = async () => {
  try {
    // Count Documents
    const count = await Role.estimatedDocumentCount();

    // check for existing Roles
    if (count > 0) return;

    // Create default Roles
    const values = await Promise.all([
      new Role({ name: "user" }).save(),
      new Role({ name: "moderator" }).save(),
      new Role({ name: "admin" }).save(),
      new Role({ name: "owner" }).save(),
      new Role({ name: "superadmin" }).save()
    ]);

    console.log(values);
  } catch (error) {
    console.error(error);
  }
};

export const createDomain = async () => {
  try {
    const count = await Domain.estimatedDocumentCount();
    const user = await User.find({ email: "saurabh@raindigi.com" });
    // check for existing Roles
    if (count > 0) return;
    const domain = await Domain.findOne({ siteUrl: "https://pushgeek.com" });
    if (!domain) {
      const domainName = await Domain.create({
        siteUrl: "https://pushgeek.com",
        siteImages: "https://pushgeek.com/images/Pushgeek.png",
        siteId: 1,
        users: user.map(Users => Users._id)
      });
      console.log(domainName);
    }
  } catch (error) {
    console.error();
  }
};

export const createOrganization = async () => {
  const orgNames = await Organisation.findOne({ orgName: "pushgeek.com" });
  const domains = await Domain.find({ siteUrl: "https://pushgeek.com" });
  const user = await User.find({ email: "saurabh@raindigi.com" });
  const role = await Role.find({
    RoleAssigned: { $in: ["admin", "moderator"] }
  });
  if (!orgNames) {
    await Organisation.create({
      orgName: "pushgeek.com",
      orgUrl: "https://pushgeek.com",
      OrgImage: "https://pushgeek.com/images/Pushgeek.png",
      OrgSize: "5",
      siteId: 1,
      domains: domains.map(Dname => Dname._id)
    });
  }
  console.log("Organisation Created");
};

export const createAdmin = async () => {
  // check for an existing admin User
  const user = await User.findOne({ email: "saurabh@raindigi.com" });
  // get Roles _id
  const Roles = await Role.find({ name: ["admin", "moderator"] });

  if (!user) {
    // create a new admin User

    await User.create({
      roles: Roles.map(Role => Role._id),
      username: "saurabh",
      email: "saurabh@raindigi.com",
      password: await bcrypt.hash("Kashyap", 10),
      phone: "911-098-3897",
      firstName: "saurabh",
      lastName: "kashyap",
      sex: "M"
    });
    console.log("Admin User Created!");
  }
};

export const updateDomain = async () => {};

export var splitStr = function(str, seperator)  {
  // Function to split string
  var string = str.split(seperator);

  console.log(string);
};

export const updateOrganisation = async () => {
  const role = await Role.find({ name: ["admin", "moderator"] });
  var hello_data = [];
  var data_ = role.map(nRole => nRole._id);
  // var seperator = ",";
  // hello_data = data_.split(seperator);
  // console.log(`checking new roles array: ${hello_data}`);
  const orgAvailable = await Organisation.updateOne(
    { orgName: "pushgeek.com" },
    {
      $addToSet: {
        AuthUser: {
          rRole: []
        }
      }
    },
    function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    }
  );

  if (orgAvailable) {
    const user = await User.findOne({ email: "saurabh@raindigi.com" });
    console.log(`roles assigned : ${role}`);
    console.log(
      `roles id is assigned: ${role.map(
        nRole => nRole._id
      )} role lable name: ${role.map(nTRole => nTRole.name)}`
    );

    console.log(`user in update org: ${user}`);
    await Organisation.findOne({ orgName: "pushgeek.com" }).then(org => {
      let roles_id = [];
      roles_id = roles_id.push(role.map(ERole => ERole._id));
      const newAuthAccess = {
        User: user._id,
        rRole: role.map(nRole => nRole._id)
      };
      org.AuthUser.unshift(newAuthAccess);
      // org.AuthUser.push(newAuthAccess.rRole._id);
      // console.log(roles_id);
      // org.AuthUser.push({ $each: roles_id, $position: 0 });
      org.save();
    });
    console.log("Organisation is updated successfully");
  } else {
    console.log("Organisation already Available !");
  }
};
export const updateUser = async () => {};
