import*as UnsubscriberCtrl from '../controllers/unsubscriber';
const express = require('express');
const router = express.Router();
const Subscription = require('../model/subscriber');
const ratelimit = require('../util/limiter');
router.get('/',ratelimit('pushlimit', 10, '', 1),async(req,res) =>{

});

router.delete('/',ratelimit('pushlimit', 10, '', 1),verifyPushSubscriber.checkSubscriberExist,UnsubscriberCtrl.UnSubscribe);


// router.delete('/', (req, res) => {
//   // const subscriptionModel = new Subscription(req.body);
//   console.log(req);
//   Subscription.remove({
//     endpoint: subscription.endpoint,
//     keys: {
//       p256dh: subscription.keys.p256dh,
//       auth: subscription.keys.auth
//     }
//   })
//     .then(() => {
//       res.json({
//         status: true,
//         data: 'Successfully Unsubcribe.'
//       });
//     })
//     .catch(err => {
//       reject({
//         status: false,
//         endpoint: subscription.endpoint,
//         data: err
//       });
//     });
// });
router.get('/', (req, res) => {
  res.json({
    data: 'Invalid Request Bad'
  });
});
module.exports = router;
