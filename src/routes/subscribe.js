const express = require('express');
const router = express.Router();
const Subscription = require('../model/subscriber');

router.post('/', (req, res) => {
  // console.log(`Data lonlat : ${JSON.stringify(req.body.browser_info.ll)}`)
  console.log(req.body);
  var Data = {
  site_id: req.body.site_id || 2,
  browser_info: {
    device_type: req.body.browser_info.device_type || "Unknown",
    browser_version: req.body.browser_info.browser_version || '90',
    user_agent: req.body.browser_info.user_agent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
    language: req.body.browser_info.language || 'en-IN',
    total_scr_width_height: req.body.browser_info.total_scr_width_height||'1280*720',
    available_scr_width_height: req.body.browser_info.available_scr_width_height||'1280*687',
    colour_resolution: req.body.browser_info.colour_resolution||24,
    host: req.body.browser_info.host || 'localhost:5500',
    device: req.body.browser_info.device || 'desktop',
    pe_ref_url: req.body.browser_info.pe_ref_url || 'http://localhost:5500'
  },
  subscription: {
    endpoint: req.body.subscription.endpoint,
    expirationTime: req.body.subscription.expirationTime || null,
    keys: {
      p256dh:req.body.subscription.keys.p256dh,
      auth: req.body.subscription.keys.auth
    },
    project_id:  req.body.subscription.project_id,
    vapid_public_key: req.body.subscription.vapid_public_key  || 'BLgFTwjElUH_Iz72TKDvmlsc-EcwziNP2X28BmN-znOXJhv35QybtfcN1HTh_eUlNffp12HkuruYpqtKNedN54s'
  },
  subscription_url: req.body.subscription_url || 'http://localhost:5500',
  geo_info:req.body.geo_info,
  token_refresh: req.body.token_refresh,
  optin_type: req.body.optin_type
  }
// console.log(`Geo Info : ${JSON.stringify(req.body.geo_info.data)}`)
  // console.log(`RAW requested Data : ${JSON.stringify(req.body)} \n\r`);
  // console.log(`Data Formated : \n${JSON.stringify(Data)}`);
  const subscriptionModel = new Subscription(Data);
  
  subscriptionModel.save((err, subscription) => {
    if(err){
      console.error(`Error occurred while saving subscription. Err: ${err}`);
      res.status(500).json({
        error: 'Technical error occurred',
        "error_code": 1001,
          "data": {},
          "error_message": "Something went wrong.",
          "error": {
              "message": "Something went wrong.",
              "code": 1001,
              "details": []
          }
      });
    }else{
      res.json({
        data: 'Subscription saved.'
      });
      console.log(`${subscription}`)
    }
  });
});

router.post('/segment/add', (req,res)=>{
  res.json(JSON.stringify(req.body));
});
router.get('/segment/add',(req,res)=>{
  res.json(JSON.stringify(req.body));
});

router.post('/alerts', (req,res)=>{
  res.json(JSON.stringify(req.body));
});
router.get('/alerts',(req,res)=>{
  res.json(JSON.stringify(req.body));
});

router.post('/goal', (req,res)=>{
  res.json(JSON.stringify(req.body));
});
router.get('/goal',(req,res)=>{
  res.json(JSON.stringify(req.body));
});

router.post('/profile-id/add', (req,res)=>{
  res.json(JSON.stringify(req.body));
});
router.get('/profile-id/add',(req,res)=>{
  res.json(JSON.stringify(req.body));
});

router.post('/segment/remove', (req,res)=>{
  res.json(JSON.stringify(req.body));
});
router.get('/segment/remove',(req,res)=>{
  res.json(JSON.stringify(req.body));
});

router.post('/dynamicSegments/add', (req,res)=>{
  res.json(JSON.stringify(req.body));
});
router.get('/dynamicSegments/add',(req,res)=>{
  res.json(JSON.stringify(req.body));
});
router.post('/updatetriggerstatus', (req,res)=>{
  res.json(JSON.stringify(req.body));
});
router.get('/updatetriggerstatus', (req,res)=>{
  res.json(JSON.stringify(req.body));
});
router.post('/check', (req,res)=>{
  res.json(JSON.stringify(req.body));
});
router.get('/check', (req,res)=>{
  res.json(JSON.stringify(req.body));
});

router.get('/', (req, res) => {
  res.json({
    data: 'Invalid Request Bad'
  });
});
module.exports = router;
