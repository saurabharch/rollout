import Push from "../model/push";
import User from "../model/user";
import Organisation from "../model/organization";
import Domain from "../model/domains";
const Subscription = require("../model/subscriber");
const q = require("q");
const webpush = require("web-push");
const keys = require("./../config/keys");
const ratelimit = require("../util/limiter");
export const createPush = async (req, res) => {
  const { name, category, price, imgURL } = req.body;

  try {
    const payload = new Push({
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
      vibrate: req.body.vibrate, //  body: 'With "requireInteraction: \'true\'".',
      //   require
      // Interaction: ,
      silent: req.body.silent,
      renotify: req.body.renotify,
      sound: "/audio/notification.mp3",
      dir: "auto",
      timestamp: Date.parse("01 Jan 2000 00:00:00"),
      urgency: req.body.urgency,
      AuthUser: {
        OrgName: req.body.orgnisationId
      }
    });

    const pushSaved = await payload.save();

    res.status(201).json(pushSaved);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getPushById = async (req, res) => {
  const { pushId } = req.params;

  const push = await Push.findById(pushId);
  res.status(200).json(push);
};

export const getPushList = async (req, res) => {
  const Pushes = await Push.find();
  return res.json(Pushes);
};

export const updatePushId = async (req, res) => {
  const updatedPush = await Push.findByIdAndUpdate(
    req.params.pushId,
    req.body,
    {
      new: true
    }
  );
  res.status(204).json(updatedPush);
};

export const deletePushById = async (req, res) => {
  const { pushId } = req.params;

  await Push.findByIdAndDelete(pushId);

  // code 200 is ok too
  res.status(204).json();
};

export const broadcastPushById = async (req, res) => {
  const { pushId } = req.params;

  const push = await Push.findById(pushId);
  console.log(push);
  try {
    Subscription.find({}, (err, subscriptions) => {
      if (err) {
        console.error(`Error occurred while getting subscriptions`);
        res.status(500).json({ error: "Technical error occurred" });
      } else {
        let parallelSubscriptionCalls = subscriptions.map(subscription => {
          return new Promise((resolve, reject) => {
            //  console.log(`p256dh key: ${subscription.keys.p256dh}`);
            const pushSubscription = {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth
              },
              domain: subscription.domain
            };
            const DomainDetails = Domain.findOne({
              siteUrl: pushSubscription.domain
            });
            console.log(`Domain Detailes: ${DomainDetails}`);
            const OrgDetails = Organisation.findOne({
              domains: DomainDetails._id
            });
            console.log(`Organisation Detailes: ${OrgDetails}`);
            const userEmailId = User.findOne({ _id: OrgDetails._id }).then(
              UserEmail => UserEmail.email
            );
            console.log(`Organisation Email Id: ${userEmailId}`);
            const pushPayload = JSON.stringify(push);
            const pushOptions = {
              // gcmAPIKey: keys.GCM_Key,
              vapidDetails: {
                subject: pushSubscription.domain,
                privateKey: keys.privateKey,
                publicKey: keys.publicKey
              },
              TTL: payload.ttl,
              headers: {}
            };
            // contentEncoding: "aes128gcm"
            // proxy: "",
            // agent: ""
            webpush.setVapidDetails(
              `mailto:${userEmailId}`,
              keys.publicKey,
              keys.privateKey,
              "aes128gcm"
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

        // Queue For Send All List of Subscirber Notification and settle down the Queue Job
        q.allSettled(parallelSubscriptionCalls).then(pushResults => {
          if (pushResults.status != true) {
            const errorEndpoint = 1;
            res.json({ res: JSON.parse(pushResults.endpoint) });
          }
          //console.info(pushResults);
        });
        res.json({ data: "Push triggered" });
      }
    });
  } catch (error) {}
};
