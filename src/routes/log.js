const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  console.log(req.body);
 
    if(req.body){
    //   console.error(`Error occurred while saving subscription. Err: ${err}`);
      res.status(200).json({
        data: JSON.stringify(req.body)
      });
    }else{
      res.json({
        data: 'Log is saved.'
      });
    }
});

router.get('/', (req, res) => {
  res.json({
    data: 'Get Some Data from LogDB'
  });
});
module.exports = router;
