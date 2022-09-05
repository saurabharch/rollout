var express = require('express');

var router = express.Router();

var noentitycheck = require('../../middleware/noentitycheck');


router.get('/', 
 function (req, res) {
    res.send('{"success":true}');
});
  
  
  router.get('/noentitycheck', 
    [noentitycheck,
    ], function (req, res) {
    res.send('{"success":true}');
  });
  

module.exports = router;