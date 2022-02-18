import * as projectCtrl from'../controllers/project';
import{ authJwt }from'../middlewares';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ratelimit = require('../util/limiter');

router.get('/', ratelimit('pushlimit', 10, '', 1), async(req, res) => {

  console.log(req.body);
  // const seetingnewv = GetSettind();
  // console.log(`${seetingnewv}`);
  // res.setHeader("X-RateLimit-Limit", 10);
  // res.setHeader("X-RateLimit-Remaining", 9);
  // res.setHeader("X-RateLimit-Reset", 1 * 60 * 1000);
  
  try{
  res.status(200)
      .json(
        `Project Data endpoint is working...!`
      );
 
  }catch(error){
    return res
      .status(403)
      .json(
        `Project Data loading is have something error || Error msg: ${error}`
      );
    res.end();
  }
});

// Get All Push List
router.get('/projectlist',ratelimit('pushlimit', 10, '', 1), 
// [authJwt.verifyToken, authJwt.isModerator], 
projectCtrl.getProjectList);

// Get push By Id
router.get('/:projectId',ratelimit('pushlimit', 10, '', 1),
// [authJwt.verifyToken, authJwt.isModerator],
projectCtrl.getProjectById);

// Save a Push Notification
router.post('/create',ratelimit('pushlimit', 10, '', 1),
  // [authJwt.verifyToken, authJwt.isModerator],
  projectCtrl.createProject
);


// Update Push notification
router.put('/:projectId',ratelimit('pushlimit', 10, '', 1),
  // [(authJwt.verifyToken, authJwt.isModerator)],
  projectCtrl.updateProjectId
);

// Delete the push notification By Id
router.delete('/:projectId',ratelimit('pushlimit', 10, '', 1),
  // [(authJwt.verifyToken, authJwt.isAdmin)],
  projectCtrl.deleteProjectById
);

module.exports = router;