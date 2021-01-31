const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  console.log(req.body);

    if(req.body){
      res.status(200).json({
        data: JSON.stringify(req.body)
      });
    }else{
      res.json({
        data: 'Analytic Data is saved.'
      });
    }
});

router.get('/', (req, res) => {
  res.json({
    data: 'Get Some Data from Ananlytics'
  });
});
module.exports = router;
