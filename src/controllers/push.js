import Push from'../model/push';
// import User from'../model/user';
import Organisation from'../model/organization';
import Domain from'../model/domains';
import Pushsetting from "../model/pushSetting";
// import {vapidKeygen} from "../util/lib/VapidKeyGen";
const vapidKeygen = require('../util/lib/VapidKeyGen');
const Subscription = require('../model/subscriber');
import{ catchAsync, isAuthenticated, isClientAuthenticated }from'../middlewares';
const q = require('q');
// const webpush = require('web-push');
const keys = require('../../config/keys');
const ratelimit = require('../util/limiter');
import PushNotifications from 'rollout-pushnotification';
const { clearKey } = require("../util/cache");
import PushController from'../jobs/controller/PushController';
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
  const session = await Push.startSession();
  session.startTransaction();
  try{
    const payload = new Push(req.body);

    const pushSaved = await payload.save();
    //clearKey(Push);
    session.commitTransaction();
    session.endSession();
    res.status(201).json(pushSaved);
  }catch(error){
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getPushById = async (req, res) => {
  const session = await Push.startSession();
  session.startTransaction();
  const { pushId } = req.params;

  const push = await Push.findById(pushId).cache({
        time: 10
      }).exec();
  session.commitTransaction();
  session.endSession();
  res.status(200).json(push);
};

export const getPushList = async (req, res) => {
   const session = await Push.startSession();
    session.startTransaction();
  const Pushes = await Push.find().cache({
        time: 10
      }).exec();
  session.commitTransaction();
  session.endSession();
  return res.json(Pushes);
};

export const updatePushId = async (req, res) => {
   const session = await Push.startSession();
    session.startTransaction();
  const updatedPush = await Push.findByIdAndUpdate(
    req.params.pushId,
    req.body,
    {
      new: true
    }
  ).cache({
        time: 10
      }).exec();
  session.commitTransaction();
  session.endSession();
  clearKey(Push.collection.collectionName);
  res.status(204).json(updatedPush);
};

export const deletePushById = async (req, res) => {
  const { pushId } = req.params;
 const session = await Push.startSession();
       session.startTransaction();
  await Push.findByIdAndDelete(pushId).cache({
        time: 10
      }).exec();
   clearKey(Push);
  // code 200 is ok too
  session.commitTransaction();
  session.endSession();
  res.status(204).json();
};

export const broadcastPushById = async (req, res) => {
  const { pushId,site_id} = req.params;
  var notificationData = {
    pushId,
    site_id
  }
  // const site_id = req.query;
  //console.log(`Push id : ${pushId} \nsite_id: ${site_id}`)
  // const pushId = "60ad6156a81a61453c344dc5"
  const registrationIds = [];
  // const session = await Push.startSession();
  const payload = await Push.findById(pushId).cache({
        time: 10
      }).exec();
      // assert.ok(payload.$session());
      // session.commitTransaction();
      // session.endSession();
  console.log(payload);
  
  try{
    // const subSession = Subscription.startSession();
  await Subscription.find({'site_id':{$in:site_id}}, (err, subscriptions) => {
      if(err){
        console.error('Error occurred while getting subscriptions');
        // subSession.abortTransaction();
        res.status(500).json({
          error: 'Technical error occurred'
        });
    }else{
         
        
        const parallelSubscriptionCalls =  subscriptions.map(subscription => {
          return new Promise((resolve, reject) => {
                // const subscriptionD = subscription.subscription.map(SUB => {
                  
                  // return new Promise((resolve, reject) => {
                    const subsObj = {
                       endpoint: subscription.endpoint,
                      keys: {
                        p256dh:subscription.keys.p256dh,
                        auth: subscription.keys.auth
                      },
                    }
                    //console.log(`registration ids: ${JSON.stringify(subsObj)}`);
                    registrationIds.push(subsObj);
                  // });
                  
                // });
              });
              
              // }
          });
            var notificationData = {
                    registrationIds,
                    payload
          }
          // console.log(`${JSON.stringify(notificationData)}`);
           PushController.notification(notificationData);
          // push.send(registrationIds, payload, (err, result) => {
          //         if (err) {
          //             console.log(err);
          //         } else {
          //           console.log(result);
          //         }
          // });
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
  }).cache({
        time: 100
      }).cursor({ batchSize: 1000 }).exec();
      // subSession.commitTransaction();
      // subSession.endSession();
  }catch(error){}
};

export const saveMessageSetting = async(req,res) => {
  //  const vapidkey = vapidKeygen(req, res);
  console.log(`Save Setting Data : ${JSON.stringify(req.body)}`)
  const SiteId = await Domain.find({siteId:req.body.site_id}).exec();
     var ID = SiteId._id;
     console.log(ID);
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
            publicKey: req.body.webPublicKey ||  keys.publicKey,
            privateKey: req.body.webPrivateKey || keys.privateKey,
        },
        gcmAPIKey: req.body.webGcmAPIKey || 'gcmkey',
        TTL: req.body.webTTL ||  2419200,
        contentEncoding: req.body.webContentEncoding || 'aes128gcm',
        headers: req.body.webHeaders || ''
    },
    isAlwaysUseFCM: req.body.isAlwaysUseFCM || false // true all messages will be sent through node-gcm (which actually uses FCM)

};
 try{
   var setting = new Pushsetting();
 const session = await Pushsetting.startSession();
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
    if(req.body.site_id){
      setting.siteId = ID;
      //setting.siteId._id = SiteId._id;
    }
    
    await setting.save().then(function(err,data) {
      // console.log(`Push setting Error Message : ${JSON.stringify(err)}`)
      clearKey(setting);
    if (err)
      {
        session.abortTransaction();
         return res.status(500).json(err);
      }
      else{
        data.upset({siteId})
          session.commitTransaction();
          session.endSession();
       return res.status(201).json({ message: 'Client added to the locker!', data: setting });
      }
    
  });
 } catch(err) {
   console.log(err.message)
 }
   
}

export const GetMessageSettingById = async(req, res) => {
  const {id} = req.param;
  const session = await Pushsetting.startSession();
    session.startTransaction();
  const SettingData = Pushsetting.findById(id).session(session).cache({
        time: 10
      }).exec();
  if (err)
      session.abortTransaction();
      return res.status(404).json(err.message);
    session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: 'Device Push Notification Message Settings!', data: SettingData });
}

export const SaveDomainName = async(req,res, next) => {
  const {siteUrl,siteImages} = req.body;
  
  const IsAvailableDomain = await Domain.findOne({ 'siteUrl':siteUrl }).exec();
  console.log(`${IsAvailableDomain}`)
  if(IsAvailableDomain){ return res.status(404).json({ message: 'Domain is associated with some other organisation \n\rPlease chose new Domain Name' }); }
   const session = await Domain.startSession();
   session.startTransaction();
  try{
   if(IsAvailableDomain == null){
     const DomainData = new Domain()
    DomainData.siteUrl = siteUrl;
    DomainData.siteImages = siteImages || '';
    const DomainDataSaved = await DomainData.save();
    clearKey(DomainData);
    session.commitTransaction();
    session.endSession();
    return res.status(201).json(DomainDataSaved);
   } 
  next();
   
  }catch(error){
    session.abortTransaction();
     res.status(500).json({ message: error.message });
  }
}

export const GetByIdDomainName = async(req, res, next) => {
  const {org_id,_id} = req.param;
  const session = await Organisation.startSession();
    session.startTransaction();
  const SettingData = Organisation.findById(org_id).cursor().map(function (doc) {
    doc.domains = `${_id}`;
    return doc;
  }).session(session).cache({
        time: 10
      }).exec();
  if (err)
      session.abortTransaction();
      return res.status(404).json(err.message);
    session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: 'Domain Name', data: SettingData });
}

export const GetAllOrgName = async(req,res,next) =>{
  const {user_id} = req.param;
  const session = await Domain.startSession();
    session.startTransaction();
  const DomainData = await Domain.findById({}).populate({path: 'user',
    match:{ _id: { $regex: user_id } }}).session(session).cache({
        time: 10
      }).execPopulate();
     console.log(`Domain Data Against Userid: ${DomainData}`)
  if (err)
      session.abortTransaction();
      return res.status(404).json(err.message);
    session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: 'Domain Name', data: DomainData });
}

export const DelDomainName = async(req,res,next) => {
  const{_id} = req.param;
 const session = await Domain.startSession();
       session.startTransaction();
  await Domain.findByIdAndDelete(_id).cache({
        time: 10
      }).exec();
   clearKey(Domain);
  // code 200 is ok too
  session.commitTransaction();
  session.endSession();
  res.status(204).json();
}

export const UpdateDomainName = async(req,res,next) => {
   const session = await Domain.startSession();
    session.startTransaction();
  const updatedDomain = await Domain.findByIdAndUpdate(
    req.params._id,
    req.body,
    {
      new: true
    }
  ).cache({
        time: 10
      }).exec();
  session.commitTransaction();
  session.endSession();
  clearKey(Domain.collection.collectionName);
  res.status(204).json(updatedDomain);
}