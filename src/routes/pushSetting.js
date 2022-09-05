import * as pushCtrl from'../controllers/push';
import * as VapidCrtl from '../controllers/VapidKey';
import{ authJwt } from'../middlewares';
const express = require('express');
import{ catchAsync, isAuthenticated, isClientAuthenticated }from'../middlewares';
const router = express.Router();
const ratelimit = require('../util/limiter');
const authController = require('../middlewares/auth');
const oauth2Controller = require('../controllers/oauth2');
const keys = require('../../config/keys');
const Pushsetting = require('../model/pushSetting');

// Get All Push Message Settings
router.get('/',ratelimit('pushlimit', 10, '', 1),catchAsync (async (req,res) => {
    var SettingData = '';
    var setData = [];
    SettingData = await Pushsetting.find({}, async(err, Pushpayloads) => {
      if(err){
        console.error('Error occurred while getting subscriptions');
        res.status(500).json({
          error: 'Technical error occurred'
        });
    }else{
     await res.status(200).json({
            setting: Pushpayloads
        });
    }
   });
}));

// Save Push Setting
router.post('/save',ratelimit('pushlimit', 10, '', 1), pushCtrl.saveMessageSetting);


// Get Push Message Setting By :ID
router.get('/:id',ratelimit('pushlimit', 10, '', 1), pushCtrl.GetMessageSettingById);

// Generate  push notifcation vapid key against the id
router.post('/vapidkey/:site_id',ratelimit('pushlimit', 10, '', 1), VapidCrtl.SaveVapidKeyAgainstDomain);

// Enable/Disable VapidKey
router.post('/vapidkey/:action',ratelimit('pushlimit', 10, '', 1),VapidCrtl.EnableVapidKey);


module.exports = router;