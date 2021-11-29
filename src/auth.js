import { Request, Response } from "express";
import { SESSION_NAME } from "./config";
import User from "./model/user";
import SessionModel from './model/session';
const responseData = require("./util/reponseStatus");
const sendResponse = require("./util/response");
var message = require('./util/responseMessages')
var APP_CONSTANT = require("./util/constants");
const config = require("config");
export const isLoggedIn = req => !!req.session.userId;

export const logIn = async (req, user) => {
  // req.session.userId = userId;
  // req.session.createdAt = Date.now();
  let timestamp = new Date().getTime();
  try {
     user.loginTime = timestamp;
          let accessToken = await createToken(req.body, user);
          let createSessionEntry = await createSession(
            req.body,
            user,
            accessToken
          );
          sendResponse(res, responseData.SIGNUP_SUCCESS, {
            accessToken: accessToken
          });
  } catch (error ) {
          return Promise.reject(error);
        };
};

export const logOut = async (req, res) =>{
  // new Promise((resolve, reject) => {
  //   req.session.destroy(err => {
  //     if (err) reject(err);

  //     res.clearCookie(SESSION_NAME);

  //     resolve();
  //   });
  try {
    let logoutUser = await logoutPreviousSession(req.userData._id, req.tokenData.deviceId);
    let updateUserCollection = await SessionModel.findOneAndUpdate({ _id: req.userData._id }, {
      isLogin: false,
      loginTime: null
    }).exec()
    console.log(logoutUser, "---->> logout user");
    sendResponse(res, responseData.LOGOUT_SUCCESS, {});
  } catch (error) {
    Promise.reject(error);
  }
  };

export const markAsVerified = async data => {
  if(data.active == false) {
     const ActiveUser = {
      active:true,
      status:1,
      verifiedAt:new Date()
    }
    await User.findOneAndUpdate({_id:data._id},ActiveUser);
  }
  //User.verifiedAt = new Date();
  
};

export const resetPassword = async (User, password) => {
  user.password = password;
  await user.save();
};


var createSession = async function (sessionData, userData, accessToken) {
  try {

    // single device login, logout old devices.
    let logoutOldDevice = await logoutPreviousSession(
      userData._id,
      sessionData.deviceId
    );

    // criteria to update in session
    let critera = {
      userId: userData._id,
      deviceId: sessionData.deviceId
    };

    // new session info
    let sessionInfo = {
      userId: userData._id,
      deviceId: sessionData.deviceId,
      deviceType: sessionData.deviceType,
      validAttempt: accessToken ? true : false,
      ipAddress: sessionData.ipAddress,
      loginStatus: true,
      createdAt: new Date().getTime(),
      deviceToken: ""
    };
    if (sessionData.appVersion)
      sessionInfo["appVersion"] = sessionData.appVersion;
    if (sessionData.deviceToken)
      sessionInfo["deviceToken"] = sessionData.deviceToken;
    if (sessionData.deviceModel)
      sessionInfo["deviceModel"] = sessionData.deviceModel;

    // create new session  
    let session = await SessionModel.update(critera, sessionInfo, {
      new: true,
      upsert: true
    });
    return;
  } catch (error) {
    return Promise.reject(error);
  }
};

var uniqueUsernameGenerator = async function (firstname) {
  console.log(firstname);
  let uniqueUsername =
    firstname.toLowerCase() +
    randomGenerate.generate({ length: 4, charset: "numeric" });
  let payload = {
    type: APP_CONSTANT.PARAM_TYPE.USERNAME,
    value: uniqueUsername
  };
  let check = await commonFunc.validateUniqueness(payload);
  console.log(uniqueUsername, "----------------------------------");
  if (check) {
    return uniqueUsername;
  } else {
    uniqueUsernameGenerator(firstname);
  }
};

var logoutPreviousSession = async function (userId, deviceId) {
  try {
    console.log(userId)
    let session = await SessionModel
      .findOneAndUpdate(
        { userId: userId },
        { loginStatus: false, updatedAt: new Date().getTime() },
        { new: true, multi: true }
      )
      .exec();
    return;
  } catch (error) {
    return Promise.reject(error);
  }
};

var createToken = async function (payload, userData) {
  try {
    let tokenData = {};
    let expiretime = config.get("development.access_token_expire_time");
    tokenData["id"] = userData._id;
    tokenData["deviceId"] = payload.deviceId;
    tokenData["timestamp"] = new Date().getTime();
    tokenData["loginTime"] = userData.loginTime;
    tokenData["rNumber"] = Math.floor(Math.random() * APP_CONSTANT.RANDOM_NUMBER_REFRESH_TOKEN) + 1;
    tokenData["exp"] = Math.floor(Date.now() / 1000) + expiretime;
    if (payload.appVersion) {
      tokenData["appVersion"] = payload.appVersion;
    }
    let accessToken = await setToken(tokenData);
    return accessToken["accessToken"];
  } catch (error) {
    return Promise.reject(error);
  }
};

var setToken = async function (tokenData) {
  try {
    let tokenToSend = await Jwt.sign(tokenData, cert, { algorithm: "HS256" });
    return { accessToken: tokenToSend };
  } catch (error) {
    return Promise.reject(error);
  }
};

var createResetToken = async function (data) {
  try {
    let encryptToken = await commonFunc.encrypt(data.email + "&" + new Date().getTime());
    return encryptToken
  } catch (error) {
    console.log(error)
  }
}
