
var mongoose = require('mongoose');

var Request = require("../model/request");
var User = require("../model/user");
var faqkb = require("../model/faq_kb");
var department = require("./model/department");
var lead = require("../model/lead");

mongoose.connect("mongodb://localhost:27017/web-push", { "useNewUrlParser": true, "autoIndex": false }, function(err) {
  if (err) { return winston.error('Failed to connect to MongoDB on '+databaseUri);}
});

(async () => {
try {
var query = {  } ;
    //console.log("start",new Date())
        var started = new Date();    

    
var requests = await Request      
    .find(query)    
    // .populate('lead')
    // .populate('department')
    // .populate('participatingBots')
    // .populate('participatingAgents')  
    // .populate({path:'requester',populate:{path:'id_user'}})
    .sort({updatedAt: 'desc'})
    .limit(1).lean()
   .exec();
   //  .exec( function(err, requests) {
   //     console.log("requests",requests);
   //  });   

   if (requests && requests.length>0) {
    requests.forEach(request => {
    
      if (request.agents && request.agents.length>0) {
        var agentsnew = new Array;
        request.agents.forEach(a => {
          agentsnew.push({id_user: a.id_user})
        });

        console.log("agentsnew",agentsnew);
        request.agents = agentsnew;

      }
     
    });
  }


   console.log("end requests", JSON.stringify(requests),requests.length,started, new Date()); 
} catch (e) {
console.log(e);
  }
 
})();

function wait () {
//   if (!EXITCONDITION)
        setTimeout(wait, 1000);
};
wait();


