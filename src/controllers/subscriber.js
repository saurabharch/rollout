const express = require('express');
const router = express.Router();
const Subscription = require('../model/subscriber');
import{ authJwt, verifySignup }from'../middlewares';
const keys = require('../../config/keys');
const ratelimit = require('../util/limiter');

export const NewSubscriber = async(req,res,next) => {

// console.log(`Data lonlat : ${JSON.stringify(req.body.browser_info.ll)}`)
  console.log(req.body);
  // const session = await Subscription.startSession();
  // session.startTransaction();
  var Data = {
  site_id: req.body.site_id || 2,
  browser_info: {
    device_type: req.body.browser_info.device_type || "Unknown",
    browser_version: req.body.browser_info.browser_version || '90',
    user_agent: req.body.browser_info.user_agent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
    language: req.body.browser_info.language || 'en-IN',
    total_scr_width_height: req.body.browser_info.total_scr_width_height||'1280*720',
    available_scr_width_height: req.body.browser_info.available_scr_width_height||'1280*687',
    colour_resolution: req.body.browser_info.colour_resolution||24,
    host: req.body.browser_info.host || 'localhost:5500',
    device: req.body.browser_info.device || 'desktop',
    pe_ref_url: req.body.browser_info.pe_ref_url || 'http://localhost:5500'
  },
  // subscription: {
    endpoint: req.body.subscription.endpoint,
    expirationTime: req.body.subscription.expirationTime || null,
    keys: {
      p256dh:req.body.subscription.keys.p256dh,
      auth: req.body.subscription.keys.auth
    },
    project_id:  req.body.subscription.project_id,
    vapid_public_key: req.body.subscription.vapid_public_key  || 'BLgFTwjElUH_Iz72TKDvmlsc-EcwziNP2X28BmN-znOXJhv35QybtfcN1HTh_eUlNffp12HkuruYpqtKNedN54s',
  // },
  subscription_url: req.body.subscription_url || 'http://localhost:5500',
  geo_info:req.body.geo_info,
  token_refresh: req.body.token_refresh,
  optin_type: req.body.optin_type
  };
  const subscriptionModel = new Subscription(Data);
  
    try{
      await subscriptionModel.save((err, subscription) => {
    if(err){
      console.error(`Error occurred while saving subscription. Err: ${err}`);
      res.status(500).json({
        error: 'Technical error occurred',
        "error_code": 1001,
          "data": {},
          "error_message": "Something went wrong.",
          "error": {
              "message": "Something went wrong.",
              "code": 1001,
              "details": []
          }
      });
      next();
    }else{
      res.status(200).json({
        data: 'Subscription saved.'
      });
      next();
      console.log(`${subscription}`)
    }
    
  });
    }
    catch{

    }
  // session.commitTransaction();
  // session.endSession();
  // clearKey(Subscription.collection.collectionName);
  res.status(200).json(subscriptionModel);
  next();
}

