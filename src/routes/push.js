import * as pushCtrl from'../controllers/push';
import * as VapidCrtl from '../controllers/VapidKey';
import{ authJwt }from'../middlewares';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Subscription = require('../model/subscriber');
const Pushsetting = require('../model/pushSetting')
const q = require('q');
const webpush = require('web-push');
const keys = require('./../config/keys');
const ratelimit = require('../util/limiter');
const moment = require('moment');
import{verifySignup}from'../middlewares';
// const {PN} = require("../controllers/devices");
// import PN from '../controllers/devices';
// import PushNotifications from 'node-pushnotifications';


router.post('/', ratelimit('pushlimit', 10, '', 1), async(req, res) => {

  console.log(req.body);
  // const seetingnewv = GetSettind();
  // console.log(`${seetingnewv}`);
  // res.setHeader("X-RateLimit-Limit", 10);
  // res.setHeader("X-RateLimit-Remaining", 9);
  // res.setHeader("X-RateLimit-Reset", 1 * 60 * 1000);
  
  try{
  
  // Set default custom data from data
    // let custom;
    // if (typeof data.custom === 'string') {
    //     custom = {
    //         message: req.body.custom,
    //     };
    // } else if (typeof data.custom === 'object') {
    //     custom = Object.assign({}, req.body.custom);
    // } else {
    //     custom = {
    //         data: req.body.custom,
    //     };
    // }
        // // Or you could use it as a promise:
        // push.send(registrationIds, data)
        //     .then((results) => { ... })
        //     .catch((err) => { ... });
        //     console.log(payload);

        //// --------> OLD METHOD ONLY FOR WEB <------------////  
        // const parallelSubscriptionCalls = subscriptions.map(subscription => {
        //   return new Promise((resolve, reject) => {
        //     //  console.log(`p256dh key: ${subscription.keys.p256dh}`);
        //     const pushSubscription = {
        //       endpoint: subscription.subscription.endpoint,
        //       keys: {
        //         p256dh: subscription.subscription.keys.p256dh,
        //         auth: subscription.subscription.keys.auth
        //       }
        //     };

        //     const pushPayload = JSON.stringify(payload);
        //     const pushOptions = {
        //       // gcmAPIKey: keys.GCM_Key,
        //       vapidDetails: {
        //         subject: 'https://pushgeek.com',
        //         privateKey: keys.privateKey,
        //         publicKey: keys.publicKey
        //       },
        //       TTL: payload.ttl,
        //       headers: {}
        //       // contentEncoding: "aes128gcm"
        //       // proxy: "",
        //       // agent: ""
        //     };
        //     webpush.setVapidDetails(
        //       'mailto:saurabh@raindigi.com',
        //       keys.publicKey,
        //       keys.privateKey,
        //       'aes128gcm'
        //     );
        //     webpush
        //       .sendNotification(pushSubscription, pushPayload, pushOptions)
        //       .then(value => {
        //         resolve({
        //           status: true,
        //           endpoint: subscription.endpoint,
        //           data: value
        //         });
        //       })
        //       .catch(err => {
        //         reject({
        //           status: false,
        //           endpoint: subscription.endpoint,
        //           data: err
        //         });
        //       });
        //   });
        // });
        // q.allSettled(parallelSubscriptionCalls).then(pushResults => {
        //   if(pushResults.status != true){
        //     const errorEndpoint = 1;
        //     res.json({ res: JSON.parse(pushResults.endpoint) });
        //   }
        //   console.info(pushResults);
        // });
    //     res.json({
    //       data: 'Push triggered'
    //     });
    //   }
  }catch(error){
    return res
      .status(200)
      .json(
        `Server is running keys are - Public key => null '\n' Private key => null || Error msg: ${error}`
      );
    res.end();
  }
});


router.get('/pushlist',ratelimit('pushlimit', 10, '', 1), 
// [authJwt.verifyToken, authJwt.isModerator], 
pushCtrl.getPushList);

router.get('/:pushId',
ratelimit('pushlimit', 10, '', 1),
// [authJwt.verifyToken, authJwt.isModerator],
pushCtrl.getPushById);

router.post(
  '/create',ratelimit('pushlimit', 10, '', 1),
  // [authJwt.verifyToken, authJwt.isModerator],
  pushCtrl.createPush
);

router.post('/send/:pushId/:site_id',ratelimit('pushlimit', 10, '', 1), pushCtrl.broadcastPushById);
router.put(
  '/:pushId',ratelimit('pushlimit', 10, '', 1),
  // [(authJwt.verifyToken, authJwt.isModerator)],
  pushCtrl.updatePushId
);

router.delete(
  '/:pushId',ratelimit('pushlimit', 10, '', 1),
  // [(authJwt.verifyToken, authJwt.isAdmin)],
  pushCtrl.deletePushById
);

// ADD Push Domain

router.post('/domain',ratelimit('pushlimit', 10, '', 1), pushCtrl.SaveDomainName)
router.post('/vapidkey/:site_id',ratelimit('pushlimit', 10, '', 1), VapidCrtl.SaveVapidKeyAgainstDomain)

module.exports = router;