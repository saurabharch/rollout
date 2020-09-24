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
  const Roles = await Role.find({
    RoleAssigned: { $in: ["admin", "moderator"] }
  });

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
export const updateOrganisation = async () => {
  const orgAvailable = await Organisation.findOne({ orgName: "pushgeek.com" });
  const role = await Role.find({
    RoleAssigned: { $in: ["admin", "moderator"] }
  });
  if (orgAvailable) {
    const user = await User.findOne({ email: "saurabh@raindigi.com" });

    console.log(`roles assigned : ${role}`);
    await Organisation.findOne({ orgName: "pushgeek.com" }).then(org => {
      const newAuthAccess = {
        User: user._id,
        rRole: "5f6913e0317383280cb0205f"
      };
      org.AuthUser.unshift(newAuthAccess);
      org.save();
    });
    console.log("Organisation is updated successfully");
  } else {
    console.log("Organisation already Available !");
  }
};
export const updateUser = async () => {};
