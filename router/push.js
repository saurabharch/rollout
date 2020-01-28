const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Subscription = mongoose.model("subscribers");
const q = require("q");
const webpush = require("web-push");
const keys = require("./../config/keys");
router.post("/", (req, res) => {
  console.log(req.body);
  const payload = {
    title: req.body.title,
    message: req.body.message,
    url: req.body.url,
    ttl: req.body.ttl,
    icon: req.body.icon,
    image: req.body.image,
    badge: req.body.badge,
    tag: req.body.tag,
    urgency: req.body.urgency
  };

  Subscription.find({}, (err, subscriptions) => {
    if (err) {
      console.error(`Error occurred while getting subscriptions`);
      res.status(500).json({
        error: "Technical error occurred"
      });
    } else {
      let parallelSubscriptionCalls = subscriptions.map(subscription => {
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
              subject: "http://example.com",
              privateKey: keys.privateKey,
              publicKey: keys.publicKey
            },
            TTL: payload.ttl,
            headers: {}
            // contentEncoding: "aes128gcm"
            // proxy: "",
            // agent: ""
          };
          // webpush.setVapidDetails(
          //   "mailto:saurabh@raindigi.com",
          //   keys.publicKey,
          //   keys.privateKey,
          //   "aes128gcm"
          // );
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
              /// console.log(err).then(response => {
              // if ((response.status = false)) {
              //   try {
              //     Subscription.find({
              //       endpoint: `${subscription.endpoint}`
              //     }).remove.exec();
              //   } catch (err) {
              //     console.log(err);
              //   }
              // }
              //console.log(1++);
              // });
            });
        });
      });
      q.allSettled(parallelSubscriptionCalls).then(pushResults => {
        if (pushResults.status != true) {
          const errorEndpoint = 1;
          res.json({
            DropService: JSON.parse(errorEndpoint++),
            res: JSON.parse(pushResults.status.false)
          });
        }
        //console.info(pushResults);
      });
      res.json({
        data: "Push triggered"
      });
    }
  });
});

router.get("/", (req, res) => {
  res.json({
    data: "Invalid Request Bad"
  });
});
module.exports = router;
