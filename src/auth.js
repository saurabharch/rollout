import { Request, Response } from "express";
import { SESSION_NAME } from "./config";
import User from "./model/user";

export const isLoggedIn = req => !!req.session.userId;

export const logIn = (req, userId) => {
  req.session.userId = userId;
  req.session.createdAt = Date.now();
};

export const logOut = (req, res) =>
  new Promise((resolve, reject) => {
    req.session.destroy(err => {
      if (err) reject(err);

      res.clearCookie(SESSION_NAME);

      resolve();
    });
  });

export const markAsVerified = async User => {
  User.verifiedAt = new Date();
  await User.save();
};

export const resetPassword = async (User, password) => {
  user.password = password;
  await user.save();
};
