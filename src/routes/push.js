import * as pushCtrl from'../controllers/push';
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
// const {PN} = require("../controllers/devices");
// import PN from '../controllers/devices';
// import PushNotifications from 'node-pushnotifications';
import PushNotifications from 'rollout-pushnotification';
const settings = {
    gcm: {
        id: null,
        phonegap: false, // phonegap compatibility mode, see below (defaults to false)
    },
    apn: {
        token: {
            key: './certs/key.p8', // optionally: fs.readFileSync('./certs/key.p8')
            keyId: 'ABCD',
            teamId: 'EFGH',
        },
        production: false // true for APN production environment, false for APN sandbox environment,
    },
    adm: {
        client_id: null,
        client_secret: null,
    },
    wns: {
        client_id: null,
        client_secret: null,
        notificationMethod: 'sendTileSquareBlock',
    },
    web: {
        vapidDetails: {
            subject: 'mailto:saurabh@raindigi.com',
            publicKey: keys.publicKey,
            privateKey: keys.privateKey,
        },
        gcmAPIKey: 'gcmkey',
        TTL: 2419200,
        contentEncoding: 'aes128gcm',
        headers: {}
    },
    isAlwaysUseFCM: false, // true all messages will be sent through node-gcm (which actually uses FCM)
};

const push = new PushNotifications(settings);

router.post('/', ratelimit('pushlimit', 10, '', 1), (req, res) => {
  console.log(req.body);
  // res.setHeader("X-RateLimit-Limit", 10);
  // res.setHeader("X-RateLimit-Remaining", 9);
  // res.setHeader("X-RateLimit-Reset", 1 * 60 * 1000);
  const registrationIds = [];
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
  // const data = {
  //   title: req.body.title, // REQUIRED for Android
  //   topic: req.body.topic, // REQUIRED for iOS (apn and gcm)
  //   /* The topic of the notification. When using token-based authentication, specify the bundle ID of the app.
  //    * When using certificate-based authentication, the topic is usually your app's bundle ID.
  //    * More details can be found under https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns
  //    */
  //   body: req.body.body,
  //   custom: {
  //       sender: req.body.sender,
  //   },
  //   priority: req.body.priority === 'normal' ? req.body.priority : 'high', // gcm, apn. Supported values are 'high' or 'normal' (gcm). Will be translated to 10 and 5 for apn. Defaults to 'high'
  //   collapseKey: req.body.collpaseKey, // gcm for android, used as collapseId in apn
  //   contentAvailable: true, // gcm, apn. node-apn will translate true to 1 as required by apn.
  //   delayWhileIdle: req.body.delayWhileIdle || false, // gcm for android
  //   restrictedPackageName: req.body.body.restrictedPackageName, // gcm for android
  //   dryRun: req.body.dryRun || false, // gcm for android
  //   icon: req.body.icon, // gcm for android
  //   image: req.body.image, // gcm for android
  //   style: req.body.style, // gcm for android
  //   picture: '', // gcm for android
  //   tag: '', // gcm for android
  //   color: '', // gcm for android
  //   clickAction: '', // gcm for android. In ios, category will be used if not supplied
  //   locKey: '', // gcm, apn
  //   titleLocKey: '', // gcm, apn
  //   locArgs: undefined, // gcm, apn. Expected format: Stringified Array
  //   titleLocArgs: undefined, // gcm, apn. Expected format: Stringified Array
  //   retries: 1, // gcm, apn
  //   encoding: '', // apn
  //   badge: 2, // gcm for ios, apn
  //   sound: '/audio/notification.mp3', // gcm, apn
  //   android_channel_id: '', // gcm - Android Channel ID
  //   notificationCount: 0, // fcm for android. badge can be used for both fcm and apn
  //   alert: { // apn, will take precedence over title and body
  //       title: 'title',
  //       body: 'body'
  //       // details: https://github.com/node-apn/node-apn/blob/master/doc/notification.markdown#convenience-setters
  //   },
  //   silent: false, // gcm, apn, will override badge, sound, alert and priority if set to true on iOS, will omit `notification` property and send as data-only on Android/GCM
  //   /*
  //    * A string is also accepted as a payload for alert
  //    * Your notification won't appear on ios if alert is empty object
  //    * If alert is an empty string the regular 'title' and 'body' will show in Notification
  //    */
  //   // alert: '',
  //   launchImage: '', // apn and gcm for ios
  //   action: '', // apn and gcm for ios
  //   category: '', // apn and gcm for ios
  //   // mdm: '', // apn and gcm for ios. Use this to send Mobile Device Management commands.
  //   // https://developer.apple.com/library/content/documentation/Miscellaneous/Reference/MobileDeviceManagementProtocolRef/3-MDM_Protocol/MDM_Protocol.html
  //   urlArgs: '', // apn and gcm for ios
  //   truncateAtWordEnd: true, // apn and gcm for ios
  //   mutableContent: 0, // apn
  //   threadId: '', // apn
  //   pushType: undefined, // apn. valid values are 'alert' and 'background' (https://github.com/parse-community/node-apn/blob/master/doc/notification.markdown#notificationpushtype)
  //   expiry: Math.floor(Date.now() / 1000) + 28 * 86400, // unit is seconds. if both expiry and timeToLive are given, expiry will take precedence
  //   timeToLive: 28 * 86400,
  //   headers: [], // wns
  //   launch: '', // wns
  //   duration: '', // wns
  //   consolidationKey: 'my notification', // ADM
  // };

    Subscription.find({}, (err, subscriptions) => {
      if(err){
        console.error('Error occurred while getting subscriptions');
        res.status(500).json({
          error: 'Technical error occurred'
        });
    }else{

        // Latest Dynamic Method for multiplatform sending notification
        // You can use it in node callback style
        const parallelSubscriptionCalls = subscriptions.map(subscription => {
          return new Promise((resolve, reject) => {
            // if(subscription.browser_info.device_type === 'Chrome')
            // {
                const pushSubscription = {
                
                endpoint: subscription.subscription.endpoint,
                keys: {
                  p256dh: subscription.subscription.keys.p256dh,
                  auth: subscription.subscription.keys.auth
                }
              };
              registrationIds.push(pushSubscription);
              // }
            });
        });
        push.send(registrationIds, payload, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                  console.log(result);
                  // res.json({
                  //   data: 'Push triggered'
                  // });
                }
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