const express = require('express');
const router = express.Router();
const Subscription = require('../model/subscriber');

router.post('/', (req, res) => {
  const subscriptionModel = new Subscription(req.body);
  console.log(req.body);
  subscriptionModel.save((err, subscription) => {
    if(err){
      console.error(`Error occurred while saving subscription. Err: ${err}`);
      res.status(500).json({
        error: 'Technical error occurred'
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
