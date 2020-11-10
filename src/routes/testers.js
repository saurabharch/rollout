const express = require('express');
const router = express.Router();
const axios = require('axios');
router.get('/', (req, res) => {
  const payload = {
    title: 'StoryBook',
    message: 'welcome friends',
    url: 'https://new-storybook.herokuapp.com',
    ttl: 60,
    icon:
      'https://cdn3.iconfinder.com/data/icons/happy-x-mas/501/santa15-128.png',
    badge:
      'https://cdn3.iconfinder.com/data/icons/happy-x-mas/501/santa15-128.png',
    data: 'Hello New World',
    tag: 'open-window',
    // actions: [
    //   {
    //     action: "Poll-Yes",
    //     title: "No",
    //     icon: "/images/demos/action-1-128x128.png"
    //   },
    //   {
    //     action: "Poll-No",
    //     title: "Yes",
    //     icon: "/images/demos/action-2-128x128.png"
    //   }
    // ],
    // vibrate: [
    //   500,
    //   110,
    //   500,
    //   110,
    //   450,
    //   110,
    //   200,
    //   110,
    //   170,
    //   40,
    //   450,
    //   110,
    //   200,
    //   110,
    //   170,
    //   40,
    //   500
    // ],
    //  body: 'With "requireInteraction: \'true\'".',
    //   require
    // Interaction: ,
    // silent: false,
    // renotify: true,
    // sound: "/audio/chim.mp3",
    // dir: "auto",
    timestamp: Date.parse('01 Jan 2000 00:00:00')
    // urgency: ""
  };
  console.log(payload);
  // req.body = " ";
  if(payload){
    console.log(payload);
    try{
      axios
        .post(
          // `http://${process.env.HOST}:${process.env.PORT}/push`,
          'http://localhost:5500/push',
          'User-Agent:KappyTech/0.0.1',
          this.payload
        )
        // .then(response => {
        //   //console.log(response);
        //  res.status(200).json({
        //     success: JSON.parse(response)
        //   });
        // })
        .catch(error => {
          console.log(error);
        });
    }catch(err){
      console.error(err);
    }
  }else{
    req.body = payload;
    return res.status(500).json({
      error: 'Technical error occurred'
    });
  }
});

module.exports = router;
