const express = require('express');
import{ catchAsync, isAuthenticated, isClientAuthenticated }from'../middlewares';
const router = express.Router();
const authController = require('../middlewares/auth');
const oauth2Controller = require('../controllers/oauth2');
const keys = require('./../config/keys');
import Pushsetting from "../model/pushSetting";

router.get('/',catchAsync (async (req,res) => {
    var SettingData = '';
    var setData = [];
    SettingData = await Pushsetting.find({}, async(err, Pushsettings) => {
      if(err){
        console.error('Error occurred while getting subscriptions');
        res.status(500).json({
          error: 'Technical error occurred'
        });
    }else{
    // console.log(JSON.stringify(`${Pushsettings}`));
    //  var DataSay = await Pushsettings.map(Pushsettingd => {
    //       return new Promise((resolve, reject) => {
    //          setData.push(Pushsettingd)
    //         });
    //       });
        res.status(200).json({
            setting: Pushsettings
        });
    }
   })
}));

router.post('/', catchAsync(async(req,res) => {
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
    setting.gcm = settings.gcm;
    setting.apn = settings.apn;
    setting.adm = settings.adm;
    setting.wns = settings.wns;
    setting.web = settings.web;
    setting.isAlwaysUseFCM = settings.isAlwaysUseFCM;
    setting.save(setting).then(function(err) {
    if (err)
      return res.send(err);

    res.json({ message: 'Client added to the locker!', data: setting });
  });

}));

module.exports = router;