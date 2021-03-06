import*as pushCtrl from'../controllers/push';
import{ authJwt }from'../middlewares';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Subscription = require('../model/subscriber');
const q = require('q');
const webpush = require('web-push');
const keys = require('./../config/keys');
const ratelimit = require('../util/limiter');
const moment = require('moment');
router.post('/', ratelimit('pushlimit', 10, '', 1), (req, res) => {
  console.log(req.body);
  // res.setHeader("X-RateLimit-Limit", 10);
  // res.setHeader("X-RateLimit-Remaining", 9);
  // res.setHeader("X-RateLimit-Reset", 1 * 60 * 1000);
  try{
    const payload = {
      title: req.body.title,
      message: req.body.message,
      url: req.body.url,
      ttl: req.body.ttl,
      icon: req.body.icon,
      image: req.body.image,
      badge: req.body.badge,
      tag: req.body.tag,
      urgency: req.body.urgency,
      actions: req.body.actions,
      vibrate: req.body.vibrate,
      data:req.body.data,
      silent: req.body.silent,
      renotify: req.body.renotify,
      sound: '/audio/notification.mp3',
      dir: 'auto',
      timestamp: moment(req.body.date).format('lll')
      //timestamp: Date.parse('01 Jan 2000 00:00:00'),
    };

    console.log(payload);
    Subscription.find({}, (err, subscriptions) => {
      if(err){
        console.error('Error occurred while getting subscriptions');
        res.status(500).json({
          error: 'Technical error occurred'
        });
      }else{
        const parallelSubscriptionCalls = subscriptions.map(subscription => {
          return new Promise((resolve, reject) => {
            //  console.log(`p256dh key: ${subscription.keys.p256dh}`);
            const pushSubscription = {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth
              }
            };

            const pushPayload = JSON.stringify(payload);
            const pushOptions = {
              // gcmAPIKey: keys.GCM_Key,
              vapidDetails: {
                subject: 'https://pushgeek.com',
                privateKey: keys.privateKey,
                publicKey: keys.publicKey
              },
              TTL: payload.ttl,
              headers: {}
              // contentEncoding: "aes128gcm"
              // proxy: "",
              // agent: ""
            };
            webpush.setVapidDetails(
              'mailto:saurabh@raindigi.com',
              keys.publicKey,
              keys.privateKey,
              'aes128gcm'
            );
            webpush
              .sendNotification(pushSubscription, pushPayload, pushOptions)
              .then(value => {
                resolve({
                  status: true,
                  endpoint: subscription.endpoint,
                  data: value
                });
              })
              .catch(err => {
                reject({
                  status: false,
                  endpoint: subscription.endpoint,
                  data: err
                });
              });
          });
        });
        q.allSettled(parallelSubscriptionCalls).then(pushResults => {
          if(pushResults.status != true){
            const errorEndpoint = 1;
            res.json({ res: JSON.parse(pushResults.endpoint) });
          }
          console.info(pushResults);
        });
        res.json({
          data: 'Push triggered'
        });
      }
    });
  }catch(error){
    return res
      .status(200)
      .json(
        `Server is running keys are - Public key => null '\n' Private key => null || Error msg: ${error}`
      );
    res.end();
  }
});

router.get('/api', pushCtrl.getPushList);

router.get('/:pushId', pushCtrl.getPushById);

router.post(
  '/api',
  // [authJwt.verifyToken, authJwt.isModerator],
  pushCtrl.createPush
);

router.post('/send/:pushId', pushCtrl.broadcastPushById);
router.put(
  '/:pushId',
  // [(authJwt.verifyToken, authJwt.isModerator)],
  pushCtrl.updatePushId
);

router.delete(
  '/:organizationId',
  // [(authJwt.verifyToken, authJwt.isAdmin)],
  pushCtrl.deletePushById
);

module.exports = router;
