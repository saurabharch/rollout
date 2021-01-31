const express = require('express');
const router = express.Router();

router.post('/version', (req, res) => {
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

router.get('/version.json', (req, res) => {
  res.json({"key":"v2.0.2","check":4,"mainJsUrl":  `http://localhost:5500/main.js`,"swJsUrl":`http://localhost:5500/sw-true.js`,"swJSHost":`http://localhost:5500/`});
});
module.exports = router;
