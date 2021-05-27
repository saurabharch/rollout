import * as pushCtrl from'../controllers/push';
import{ authJwt }from'../middlewares';
const express = require('express');
import{ catchAsync, isAuthenticated, isClientAuthenticated }from'../middlewares';
const router = express.Router();
const ratelimit = require('../util/limiter');
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
        res.status(200).json({
            setting: Pushsettings
        });
    }
   })
}));

router.post('/save', pushCtrl.saveMessageSetting);
router.get('/:id', pushCtrl.GetMessageSettingById)

module.exports = router;