var express = require('express');

var router = express.Router({mergeParams: true});
var roleChecker = require('../../middlewares/has-role');

var noentitycheck = require('../../middlewares/noentitycheck');


router.get('/',  function (req, res) {
    res.send('{"success":true}');
  });
  
  router.get('/bot', [   
    roleChecker.hasRoleOrTypes(null,['bot'])],
     function (req, res) {
    res.send('{"success":true}');
  });
  
  router.get('/noentitycheck', 
    [noentitycheck,
    ], function (req, res) {
    res.send('{"success":true}');
  });
  

module.exports = router;