import Push from'../model/push';
import User from'../model/user';
import Organisation from'../model/organization';
import Domain from'../model/domains';
import Pushsetting from "../model/pushSetting";
const Subscription = require('../model/subscriber');
import{ catchAsync, isAuthenticated, isClientAuthenticated }from'../middlewares';
const q = require('q');
const webpush = require('web-push');
const keys = require('./../config/keys');
const ratelimit = require('../util/limiter');
import PushNotifications from 'rollout-pushnotification';
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
export const createPush = async (req, res) => {
  const { name, category, price, imgURL } = req.body;

  try{
    const payload = new Push(req.body);

    const pushSaved = await payload.save();

    res.status(201).json(pushSaved);
  }catch(error){
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
  console.log(`${pushId}`)
  // const pushId = "60ad6156a81a61453c344dc5"
  const registrationIds = [];
  const payload = await Push.findById(pushId);
  console.log(payload);
  
  try{
  await Subscription.find({}, (err, subscriptions) => {
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
                const subscriptionD = subscription.subscription.map(SUB => {
                  
                  return new Promise((resolve, reject) => {
                    const subsObj = {
                       endpoint: SUB.endpoint,
                      keys: {
                        p256dh:SUB.keys.p256dh,
                        auth: SUB.keys.auth
                      },
                    }
                    registrationIds.push(subsObj);
                  });
                  
                });
              });
              
              // }
          });
          push.send(registrationIds, payload, (err, result) => {
                  if (err) {
                      console.log(err);
                  } else {
                    console.log(result);
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
  });
  }catch(error){}
};

export const saveMessageSetting = async(req,res) => {
      const settings = {
    gcm: {
        id: req.body.gcmId,
        phonegap: req.body.gcmPhonegap || false, // phonegap compatibility mode, see below (defaults to false)
    },
    apn: {
        token: {
            key: req.body.apnTokenKey || 'ABCD', // optionally: fs.readFileSync('./certs/key.p8')
            keyId: req.body.apnTokenId || 'ABCD',
            teamId: req.body.apnTokenTeamId || 'EFGH',
        },
        
        production: req.body.apnProduction || false // true for APN production environment, false for APN sandbox environment,
    },
    adm: {
        client_id: req.body.admClient_id || null,
        client_secret: req.body.admClient_secret || null,
    },
    wns: {
        client_id: req.body.wnsClient_id || null,
        client_secret: req.body.wnsClient_secret || null,
        notificationMethod: req.body.wnsNotificationMethod || 'sendTileSquareBlock',
    },
    web: {
        vapidDetails: {
            subject: req.body.webSubject || 'mailto:saurabh@raindigi.com',
            publicKey: req.body.webPublicKey || keys.publicKey,
            privateKey: req.body.webPrivateKey || keys.privateKey,
        },
        gcmAPIKey: req.body.webGcmAPIKey || 'gcmkey',
        TTL: req.body.webTTL ||  2419200,
        contentEncoding: req.body.webContentEncoding || 'aes128gcm',
        headers: req.body.webHeaders || ''
    },
    isAlwaysUseFCM: req.body.isAlwaysUseFCM || false, // true all messages will be sent through node-gcm (which actually uses FCM)
};
 var setting = new Pushsetting();
 const session = await setting.startSession();
    session.startTransaction();
    if(req.body.gcmId){
      setting.gcm = settings.gcm;
    }
    if(req.body.apnTokenKey)
    {
      setting.apn = settings.apn;
    }
    if(req.body.admClient_id && req.body.admClient_secret)
    {
      setting.adm = settings.adm;
    }
    if(req.body.wnsClient_id && req.body.wnsClient_secret){
      setting.wns = settings.wns;
    }
    if(req.body.webPublicKey && req.body.webPrivateKey || req.body.webGcmAPIKey )
    {
      setting.web = settings.web;
    }
    if(req.body.isAlwaysUseFCM){
      setting.isAlwaysUseFCM = settings.isAlwaysUseFCM;
    }
    
    await setting.save(setting).then(function(err) {
    if (err)
      return res.status(404).json(err.message);

    res.status(200).json({ message: 'Client added to the locker!', data: setting });
  });

}

export const GetMessageSettingById = async(req, res) => {
  const {id} = req.param;
  const SettingData = Pushsetting.findById(id);
  if (err)
      return res.status(404).json(err.message);

    res.status(200).json({ message: 'Device Push Notification Message Settings!', data: SettingData });
}