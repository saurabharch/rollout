var express = require('express');
var router = express.Router();
var Project = require("../../model/project");
var winston = require('../../../config/winston');
var Project_user = require("../../model/project_user");
var operatingHoursService = require("../../services/operatingHoursService");
var AnalyticResult = require("../../model/analyticResult");
var Department = require("../../model/department");
var RoleConstants = require("../../model/roleConstants");
var cacheUtil = require('../../utils/cacheUtil');

router.get('/load', function(req, res, next) {
  winston.debug(req.projectid);
  
  // https://stackoverflow.com/questions/24258782/node-express-4-middleware-after-routes
  next();      // <=== call next for following middleware 
  // redirect to widget
});

router.get('/', function(req, res, next) {
    winston.debug(req.projectid);


    var availableUsers = function() {
      winston.debug('availableUsers:');
      return new Promise(function (resolve, reject) {
        if (!req.project) {
          return reject({err: "Project Not Found"});
        }
      operatingHoursService.projectIsOpenNow(req.projectid, function (isOpen, err) {    
          winston.debug('isOpen:'+ isOpen);
          if (isOpen) {            
            Project_user.find({ id_project: req.projectid, user_available: true, role: { $in : [RoleConstants.OWNER, RoleConstants.ADMIN, RoleConstants.SUPERVISOR, RoleConstants.AGENT]}, status: "active" }).
              populate('id_user').
              exec(function (err, project_users) {
                winston.debug('project_users:'+ project_users);
                if (project_users) {    
                  user_available_array = [];
                  project_users.forEach(project_user => {
                    if (project_user.id_user) {
                      user_available_array.push({ "id": project_user.id_user._id, "firstname": project_user.id_user.firstname });
                    } else {
                      winston.debug('else:');
                    }
                  });      
                  winston.debug('user_available_array:'+ JSON.stringify(user_available_array));          
                  return resolve(user_available_array);
                }
              });
          } else {          
            return resolve([]);
          }
        });
      });
  };

  var waiting = function() {
    return new Promise(function (resolve, reject) {
      AnalyticResult.aggregate([
        //last 4
        { $match: {"id_project":req.projectid, "createdAt" : { $gte : new Date((new Date().getTime() - (4 * 60 * 60 * 1000))) }} },
        { "$group": { 
          "_id": "$id_project", 
          "waiting_time_avg":{"$avg": "$waiting_time"}
        }
      },
      
    ])
    // .cache(cacheUtil.longTTL, req.projectid+":analytics:query:waiting:avg:4hours")        
    .exec(function(err, result) {
          return resolve(result);
    });
  });
  };

  
  var getIp = function() {
    return new Promise(function (resolve, reject) {
    //  var ip = req.ip;
    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);
      winston.debug("ip:"+ ip);
      return resolve(ip);
  });
  };

  
  var getDepartments = function(req) {

    return new Promise(function (resolve, reject) {

      var query = { "id_project": req.projectid, "status": 1 };

      winston.debug("req.project:" + JSON.stringify(req.project));
      
      if (req.project) {
        if (req.project.profile && (req.project.profile.type === 'free' && req.project.trialExpired === true) || (req.project.profile.type === 'payment' && req.project.isActiveSubscription === false)) {
          query.default = true;
        }
  
        winston.debug("query:", query);
  
        Department.find(query).exec(function(err, result) {
              return resolve(result);
        });
      } else {        
          return reject({err: "Project Not Found"});        
      }


    });

  }


  var getProject = function(req) {
    winston.debug('getProject.');

    return new Promise(function (resolve, reject) {

       //@DISABLED_CACHE .cache(cacheUtil.queryTTL, "projects:query:id:status:100:"+req.projectid+":select:-settings")            
      
      Project.findOne({_id: req.projectid, status: 100}).select('-settings -ipFilter -ipFilterEnabled').exec(function(err, project) {
        // not use .lean I need project.trialExpired 

          if (err) {
            return reject({err: "Project Not Found"});        
          }

          if (project && project.profile && (project.profile.type === 'free' && project.trialExpired === true) || (project.profile.type === 'payment' && project.isActiveSubscription === false)) {
            winston.debug('getProject remove poweredBy tag', project);
            project.widget.poweredBy = undefined;
            project.widget.baloonImage = undefined;            
          }

        return resolve(project);
      });        

    });

  }

// TOOD add labels
    Promise.all([

        getProject(req)
      ,
        availableUsers()
      ,
        getDepartments(req)
      ,
        // waiting()unused used 620e87f02e7fda00350ea5a5/publicanalytics/waiting/current
      , 
        getIp()
     

    ]).then(function(all) {
      let result = {project: all[0], user_available: all[1], departments: all[2], waiting: all[3], ip: all[4]};
      res.json(result);
      // https://stackoverflow.com/questions/24258782/node-express-4-middleware-after-routes
      next();      // <=== call next for following middleware 

    }).catch(function(err) {
      winston.error('Error getting widget.', err);
      return res.status(500).send({success: false, msg: 'Error getting widget.'});
    });


  });



  


  

  


module.exports = router;
