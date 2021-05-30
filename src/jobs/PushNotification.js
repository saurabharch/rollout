const q = require('q');
import PushNotifications from 'rollout-pushnotification';
import Pushsetting from "../model/pushSetting";
import Push from'../model/push';
import User from'../model/user';
const keys = require('./../config/keys');
const Subscription = require('../model/subscriber');
// const { clearKey } = require("../util/cache");

const settings = {
    gcm: {
        id: null,
        phonegap: false, // phonegap compatibility mode, see below (defaults to false)
    },
    // apn: {
    //     token: {
    //         key: '', //'./certs/key.p8', // optionally: fs.readFileSync('./certs/key.p8')
    //         keyId: 'ABCD',
    //         teamId: 'EFGH',
    //     },
        
    //     production: false // true for APN production environment, false for APN sandbox environment,
    // },
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
export default{
  key: 'PushNotification',
  async handle({ data }){
    const { notificationData } = data;
   //console.log(` Registered Ids : ${notificationData.registrationIds} \n\rNotification Payload : ${notificationData.payload}`);
          push.send(notificationData.registrationIds, notificationData.payload, (err, result) => {
                  if (err) {
                      console.log(err);
                  } else {
                    console.log(result);
                  }
        });
    }
}