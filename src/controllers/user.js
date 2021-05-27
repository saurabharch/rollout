import User from'../model/user';
import Role from'../model/role';
import{ logIn }from'../auth';
import{ sendMail }from'../mail';
import { v4 as uuidv4 } from 'uuid';
const colors = require("colors");
import{ BadRequest }from'../errors';
import UserController from'../jobs/controller/UserController';
export const createUser = async (req, res, next) => {
      var testM = [];
    const FullData ='';
      try{
    const { username, email, password, roles } = req.body;
    console.log(req.body);
    const rolesFound = await Role.find({ name: { $in: roles } });

    // creating a new User
    const user = new User({
      username,
      email,
      password,
      roles: rolesFound.map(role => role._id)
    });

    // encrypting password
    // user.password = await User.encryptPassword(user.password);

    // saving the new user
    const savedUser = await user.save();
      const link = user.verificationUrl();
      var Cdata = [];
      Cdata.push({roles: data.roles,
        username: data.username,
        email:data.email,
        firstName:data.firstName,
        lastName:data.lastName,
        link: link
      });
      FullData = Cdata;
      const serial = '';
      UserController.store(FullData);
      testM.push(FullData);
    return res.status(200).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      roles: savedUser.roles,
      link: link
    });
  }catch(error){
    console.error(error);
  }
};

export const getUsers = async (req, res) => {};

export const getUser = async (req, res) => {};
