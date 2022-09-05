import Client from "../model/client";
// import User from'../model/user';
const User = require("../model/user");
import Role from'../model/role';
// import comparePassword from '../model/user';
import jwt from'jsonwebtoken';
const config = require('../../config/auth');
// const otpMiddleware = require('../middlewares/otpMiddleware');
import otpMiddleware from '../middlewares';


export const signUp = async (req, res) => {
  try{
    // Getting the Request Body
    const { username, email, password, roles } = req.body;
    // Creating a new User Object
    const newUser = new User({
      username,
      email,
      password: await User.encryptPassword(password)
    });

    // checking for roles
    if(req.body.roles){
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map(role => role._id);
    }else{
      const role = await Role.findOne({ name: 'user' });
      newUser.roles = [role._id];
    }

    // Saving the User Object in Mongodb
    const savedUser = await newUser.save();

    // Create a token
    const token = jwt.sign({ id: savedUser._id }, config.SESS_OPTIONS.SESS_SECRET, {
      expiresIn: 86400 // 24 hours
    });

    return res.status(200).json({ token });
  }catch(error){
    console.log(error);
    return res.status(500).json(error);
  }
};

export const signin = async (req, res, callback, next) => {
  try{
    console.log(`${req.body.username}`);
    // Request body email can be an email or username
    const {username, password, email} = req.body;
    const userFound = '';
    if(!email) {
       userFound = User.findOne({username: username}).exec(function(error, user) {
      if (error) {
        callback({error: true})
      } else if (!user) {
        callback({error: true})
      } else {
        user.comparePassword(password, function(matchError, isMatch) {
          if (matchError) {
            callback({error: true})
          } else if (!isMatch) {
            callback({error: true})
          } else {
            callback({success: true})
          }
        })
      }
    });
    }else{
       userFound = User.findOne({email: email}).exec(function(error, user) {
      if (error) {
        callback({error: true})
      } else if (!user) {
        callback({error: true})
      } else {
        user.comparePassword(password, function(matchError, isMatch) {
          if (matchError) {
            callback({error: true})
          } else if (!isMatch) {
            callback({error: true})
          } else {
            callback({success: true})
          }
        })
      }
    });
    }
    const token = jwt.sign({ id: userFound._id }, config.SESS_OPTIONS.SESS_SECRET, {
      expiresIn: 86400 // 24 hours
    });
   if(token){
     res.status(200).json({token});
   }else{
      res.send(token);
   }  
  console.log(`${token}`)
  //     try{
  //          const decoded  = jwt.verify(token,config.SESS_OPTIONS.SESS_SECRET);
  //          req.userData = decoded;
  //          next();
  //       }catch(error){
  //           return res.status(401).json({message:'Auth failed'});
  //       }
  }catch(error){
    console.log(error);
  }
   next();   
};

export const LoginWithOtp = async(req,res,callback,next) => {
  
   otpMiddleware.createNewOTP(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}

export const VerifyWithOtp = async(req,res,callback,next) => {
   otpMiddleware.verifyOTP(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
}

export const verifyJWT = async(req,res,callback,next) => {

}