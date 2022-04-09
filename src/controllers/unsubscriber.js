const express = require('express');
const router = express.Router();
const Subscription = require('../model/subscriber');
const keys = require('./../config/keys');
const ratelimit = require('../util/limiter');

export const UnSubscribe = async(req,res,next) => {

    console.log(req);
  await Subscription.remove({
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth
    }
  })
    .then(() => {
      res.json({
        status: true,
        data: 'Successfully Unsubcribe.'
      });
    })
    .catch(err => {
      reject({
        status: false,
        endpoint: subscription.endpoint,
        data: err
      });
    });

}