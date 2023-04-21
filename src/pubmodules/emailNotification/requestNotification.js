'use strict';

var emailService = require("../../services/emailService");
var Project = require("../../model/projectnew");
var Request = require("../../model/request");
var RequestConstants = require("../../model/requestConstants");
var Project_user = require("../../model/project_user");

var User = require("../../model/usernew");
var Lead = require("../../model/lead");
var Message = require("../../model/message");
const requestEvent = require('../../event/requestEvent');
var winston = require('../../../config/winston');
var RoleConstants = require("../../model/roleConstants");
var ChannelConstants = require("../../model/channelConstants");
var cacheUtil = require('../../utils/cacheUtil');

const messageEvent = require('../../event/messageEvent');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
// const uuidv4 = require('uuid/v4');
var config = require('../../../config/database');
var configGlobal = require('../../../config/global');

var widgetConfig = require('../../../config/widget');
var widgetTestLocation = process.env.WIDGET_TEST_LOCATION || widgetConfig.testLocation;
let configSecret = process.env.GLOBAL_SECRET || config.secret;

let apiUrl = process.env.API_URL || configGlobal.apiUrl;
winston.debug('********* RequestNotification apiUrl: ' + apiUrl);

class RequestNotification {


listen() {
    var that = this;
    


    var messageCreateKey = 'message.create';
    if (messageEvent.queueEnabled) {
      messageCreateKey = 'message.create.queue';
    }
    winston.debug('RequestNotification messageCreateKey: ' + messageCreateKey);


    messageEvent.on(messageCreateKey, function(message) {

      setImmediate(() => {      
        winston.debug("sendUserEmail", message);
        
        if (message.attributes && message.attributes.subtype==='info') {
          return winston.debug("not sending sendUserEmail for attributes.subtype info messages");
        }


        if (message.request && (message.request.channel.name===ChannelConstants.EMAIL || message.request.channel.name===ChannelConstants.FORM)) {

          if (message.sender != message.request.lead.lead_id) {
            winston.verbose("sending sendToUserEmailChannelEmail for EMAIL or FORM channel");
            return that.sendToUserEmailChannelEmail(message.id_project, message);           
          } else {

            if (message.text != message.request.first_text) {              
              winston.verbose("sending sendToAgentEmailChannelEmail for EMAIL or FORM channel");
              return that.sendToAgentEmailChannelEmail(message.id_project, message);           
            } else {
              winston.debug("sending sendToAgentEmailChannelEmail for EMAIL or FORM channel disabled for first text message")
            }
            
          }
          
        } else {
          winston.debug("sendUserEmail chat channel");
              // controlla se sta funzionando
          if (process.env.DISABLE_SEND_OFFLINE_EMAIL === "true" || process.env.DISABLE_SEND_OFFLINE_EMAIL === true ) {
            return winston.debug("DISABLE_SEND_OFFLINE_EMAIL disabled");
          }
            // mandare email se ultimo messaggio > X MINUTI configurato in Notification . potresti usare request.updated_at ?
          if (message.request && message.request.lead && message.sender != message.request.lead.lead_id) {
            winston.debug("sendUserEmail", message);

            // send an email only if offline and has an email 
            return that.sendUserEmail(message.id_project, message);
          }
          
        }
         
      
        
      });
     });

     var requestCreateKey = 'request.create';
     if (requestEvent.queueEnabled) {
       requestCreateKey = 'request.create.queue';
     }
     winston.debug('RequestNotification requestCreateKey: ' + requestCreateKey);

     requestEvent.on(requestCreateKey, function(request) {
      // winston.info('quiiiiiiiiiiiii');
      setImmediate(() => {
   
        /*
        if (request && (request.channel.name===ChannelConstants.EMAIL || request.channel.name===ChannelConstants.FORM )) {
          winston.verbose("sending sendEmailChannelTakingNotification for EMAIL or FORM channel");
         that.sendEmailChannelTakingNotification(request.id_project, request)
        } 
        */
        
        that.sendAgentEmail(request.id_project, request);
        
      });
     });


     var requestParticipantsUpdateKey = 'request.participants.update';
    //  this is not queued
    //  if (requestEvent.queueEnabled) {
    //   requestParticipantsUpdateKey = 'request.participants.update.queue';
    //  }
     winston.debug('RequestNotification requestParticipantsUpdateKey: ' + requestParticipantsUpdateKey);

     requestEvent.on(requestParticipantsUpdateKey, function(data) {

      winston.debug("requestEvent request.participants.update");

      var request = data.request;
      
      setImmediate(() => {
   
         that.sendAgentEmail(request.id_project, request);
      });
     });

    //  requestEvent.on("request.update.preflight", function(request) {
      
    //   winston.info("requestEvent request.update.preflight");

    //   setImmediate(() => {
   
    //      that.sendAgentEmail(request.id_project, request);
    //   });
    //  });


     

    //  TODO Send email also for addAgent and reassign. Alessio request for pooled only?

    var requestCloseExtendedKey = 'request.close.extended';
        //  this is not queued
    // if (requestEvent.queueEnabled) {
    //   requestCloseExtendedKey = 'request.close.extended.queue';
    // }
    winston.debug('RequestNotification requestCloseExtendedKey: ' + requestCloseExtendedKey);
    requestEvent.on(requestCloseExtendedKey, function(data) {
      setImmediate(() => {
        var request = data.request;
        var notify = data.notify;
        if (notify==false) {
          winston.debug("sendTranscriptByEmail notify disabled", request);
          return;
        }
        var id_project = request.id_project;
        var request_id  = request.request_id;
 
        try {                
          Project.findOne({_id: id_project, status: 100}, function(err, project){   
            winston.debug("sendTranscriptByEmail", project);

            if (project && project.settings && project.settings.email && 
              project.settings.email.autoSendTranscriptToRequester &&  
              project.settings.email.autoSendTranscriptToRequester === true && 
              project.profile && 
              (
                (project.profile.type === 'free' && project.trialExpired === false) || 
                (project.profile.type === 'payment' && project.isActiveSubscription === true)
              )
            ) 
              {

              //send email to admin
              Project_user.find({ id_project: id_project,  role: { $in : [RoleConstants.OWNER, RoleConstants.ADMIN]}, status: "active"} ).populate('id_user')
              .exec(function (err, project_users) {

                if (project_users && project_users.length>0) {
                  project_users.forEach(project_user => {
                    if (project_user.id_user && project_user.id_user.email) {
                      return that.sendTranscriptByEmail(project_user.id_user.email, request_id, id_project, project);                              
                    } else {
                    }
                  });  
                }                      

              });
              //end send email to admin

              //send email to lead
              return Lead.findById(request.requester_id, function(err, lead){
                //if (lead && lead.email) {
                  if (lead && lead.email) {
                    return that.sendTranscriptByEmail(lead.email, request_id, id_project, project);
                  }
                  
              });
              //end send email to lead

            } else {
              winston.verbose("sendTranscriptByEmail disabled for project with id: "+ id_project);
            }
          });
        }catch(e) {
          winston.error("error sendTranscriptByEmail ", e);
        }

      });
  });
}


sendToUserEmailChannelEmail(projectid, message) {
  try {

    if (!message.request) {
      return winston.debug("This is a direct message");
    }

    if (!message.request.lead || !message.request.lead.email) {
      return winston.debug("The lead object is undefined or has empty email");
    }

    Project.findOne({_id: projectid, status: 100}).select("+settings").exec(function(err, project){
      if (err) {
        return winston.error(err);
      }
  
      if (!project) {
       return winston.warn("Project not found", projectid);
      } 

      // if (project.settings && project.settings.email && project.settings.email.notification && project.settings.email.notification.conversation && project.settings.email.notification.conversation.offline && project.settings.email.notification.conversation.offline.blocked == true ) {
      //   return winston.info("RequestNotification offline email notification for the project with id : " + projectid + " for  the conversations is blocked");
      // }
  

      // if (project.settings && project.settings.email && project.settings.email.notification && project.settings.email.notification.conversation && project.settings.email.notification.conversation.offline && project.settings.email.notification.conversation.offline.enabled == false ) {
      //   return winston.info("RequestNotification offline email notification for the project with id : " + projectid + " for the offline conversation is disabled");
      // }

      let lead = message.request.lead;
      winston.debug("sending channel emaol email to lead ", lead);

      
      winston.debug("sending user email to  "+ lead.email);

      var signOptions = {
        issuer:  'https://rollout.com',
        subject:  'userexternal',
        audience:  'https://rollout.com',
        jwtid: uuidv4()        
      };


      var recipient = lead.lead_id;
      winston.debug("recipient:"+ recipient);

      let userEmail = {_id: recipient, firstname: lead.fullname, lastname: lead.fullname, email: lead.email, attributes: lead.attributes};
      winston.debug("userEmail  ",userEmail);


      var token = jwt.sign(userEmail, configSecret, signOptions);
      winston.debug("token  "+token);

      var sourcePage = widgetTestLocation + "?rollout_projectid=" 
                  + projectid + "&project_name="+encodeURIComponent(project.name)                   

      if (message.request.sourcePage) {
        sourcePage = message.request.sourcePage;                    
      }
      
      if (sourcePage.indexOf("?")===-1) {
        sourcePage = sourcePage + "?";                   
      }

      sourcePage = sourcePage  
                  + "&rollout_recipientId="+message.request.request_id 
                  + "&rollout_isOpen=true";
      
                
      sourcePage = apiUrl + "/urls/redirect?path=" + encodeURIComponent(sourcePage)
      winston.debug("sourcePage  "+sourcePage);


      var tokenQueryString;      
      if(sourcePage && sourcePage.indexOf('?')>-1) {  //controllo superfluo visto che lo metto prima? ma lascio comunque per indipendenza
        tokenQueryString =  encodeURIComponent("&rollout_jwt=JWT "+token)
      }else {
        tokenQueryString =  encodeURIComponent("?rollout_jwt=JWT "+token);
      }
      winston.debug("tokenQueryString:  "+tokenQueryString);
      
      emailService.sendEmailChannelNotification(message.request.lead.email, message, project, tokenQueryString, sourcePage);
    

    });

  } catch(e) {
    winston.error("Error sending email", {error:e, projectid:projectid, message:message});
  }
}




sendToAgentEmailChannelEmail(projectid, message) {
    let savedRequest = message.request;
      // send email
      try {
     
     
      Project.findOne({_id: projectid, status: 100}).select("+settings").exec(async function(err, project){
         if (err) {
           return winston.error(err);
         }
     
         if (!project) {
          return winston.warn("Project not found", projectid);
         } else {
           
            winston.debug("project", project);            
  
            if (project.settings && project.settings.email && project.settings.email.notification && project.settings.email.notification.conversation && project.settings.email.notification.conversation.blocked == true ) {
              return winston.verbose("RequestNotification email notification for the project with id : " + projectid + " for all the conversations is blocked");
            }
  
            winston.debug("savedRequest", savedRequest);
  
                // TODO fare il controllo anche sul dipartimento con modalità assigned o pooled
                   if (savedRequest.status==RequestConstants.UNASSIGNED) { //POOLED
  
                    if (project.settings && project.settings.email && project.settings.email.notification && project.settings.email.notification.conversation && project.settings.email.notification.conversation.ticket && project.settings.email.notification.conversation.ticket.pooled == false ) {
                      return winston.info("RequestNotification email notification for the project with id : " + projectid + " for the pooled conversation ticket is disabled");
                    }
                    
                    if (!savedRequest.snapshot) {
                      return winston.warn("RequestNotification savedRequest.snapshot is null :(. You are closing an old request?");
                    }



                    
                    var snapshotAgents = await Request.findById(savedRequest.id).select({"snapshot":1}).exec();

                    winston.debug('snapshotAgents',snapshotAgents);                              


                    // winston.info("savedRequest.snapshot.agents", savedRequest.snapshot.agents);
                    // agents è selected false quindi nn va sicuro
                    if (!snapshotAgents.snapshot.agents) {
                      return winston.warn("RequestNotification snapshotAgents.snapshot.agents is null :(. You are closing an old request?", savedRequest);
                    }
                    
                    //  var allAgents = savedRequest.agents;
                     var allAgents = snapshotAgents.snapshot.agents;
                    // winston.debug("allAgents", allAgents);
     
                     allAgents.forEach(project_user => {
                    //  winston.debug("project_user", project_user); //DON'T UNCOMMENT THIS. OTHERWISE this.agents.filter of models/request.js:availableAgentsCount has .filter not found.
     
  
                    var userid = project_user.id_user;
                    
                     if (project_user.settings && project_user.settings.email && project_user.settings.email.notification && project_user.settings.email.notification.conversation && project_user.settings.email.notification.conversation.ticket && project_user.settings.email.notification.conversation.ticket.pooled == false ) {
                       return winston.verbose("RequestNotification email notification for the user with id " +  userid+ " the pooled conversation ticket is disabled");
                     }                  
                      
                       User.findOne({_id: userid , status: 100})
                        //@DISABLED_CACHE .cache(cacheUtil.defaultTTL, "users:id:"+userid)
                        .exec(function (err, user) {
                         if (err) {
                         //  winston.debug(err);
                         }
                         if (!user) {
                          winston.warn("User not found", userid);
                         } else {
                           winston.verbose("Sending sendNewPooledMessageNotification to user with email: "+ user.email);
                           if (user.emailverified) {
                             emailService.sendNewPooledMessageEmailNotification(user.email, savedRequest, project, message);
                           }else {
                             winston.verbose("User email not verified", user.email);
                           }
                         }
                       });
     
                       
                     });
     
                     }
  
                     // TODO fare il controllo anche sul dipartimento con modalità assigned o pooled
                     else if (savedRequest.status==RequestConstants.ASSIGNED) { //ASSIGNED
  
                      if (project.settings && project.settings.email && project.settings.email.notification && project.settings.email.notification.conversation && project.settings.email.notification.conversation.ticket && project.settings.email.notification.conversation.ticket.assigned == false ) {
                        return winston.verbose("RequestNotification email notification for the project with id : " + projectid + " for the assigned conversation ticket is disabled");
                      }
  
  
                      var assignedId = savedRequest.participants[0];
  
                      //  winston.info("assignedId1:"+ assignedId);
  
                      //  if (!assignedId) {
                      //    console.log("attention90", savedRequest);
                      //  }
  
  
                      
                      Project_user.findOne( { id_user:assignedId, id_project: projectid, status: "active"}) //attento in 2.1.14.2
                      .exec(function (err, project_user) {
                        
                          winston.debug("project_user notification", project_user);
                          if (project_user && project_user.settings && project_user.settings.email && project_user.settings.email.notification && project_user.settings.email.notification.conversation && project_user.settings.email.notification.conversation.ticket && project_user.settings.email.notification.conversation.ticket.assigned &&  project_user.settings.email.notification.conversation.ticket.assigned.toyou == false ) {
                            return winston.info("RequestNotification email notification for the user with id : " + assignedId + " for the pooled conversation ticket is disabled");
                          }
  
                          // botprefix
                          if (assignedId.startsWith("bot_")) {
                            return ;
                          }
        
                          User.findOne({_id: assignedId, status: 100})
                            //@DISABLED_CACHE .cache(cacheUtil.defaultTTL, "users:id:"+assignedId)
                            .exec(function (err, user) {
                            if (err) {
                              winston.error("Error sending email to " + savedRequest.participants[0], err);
                            }
                            if (!user) {
                              winston.warn("User not found",  savedRequest.participants[0]);
                            } else {
                              winston.verbose("Sending sendNewAssignedAgentMessageEmailNotification to user with email: "+ user.email);
                              //  if (user.emailverified) {    enable it?     send anyway to improve engagment for new account     
                              // attento cambia           
                                emailService.sendNewAssignedAgentMessageEmailNotification(user.email, savedRequest, project, message);
                              //  }
                            }
                          });
  
                        });
  
                     }
  
  
  
                     else {
                      return winston.debug("Other states");
                     }
     
     
           
           }
     
     });
     
     } catch (e) {
       winston.warn("Error sending email", {error:e, projectid:projectid, message: message, savedRequest:savedRequest}); //it's better to view error email at this stage
     }
     //end send email
     
     }
  



//unused
sendEmailChannelTakingNotification(projectid, request) {
  try {


    if (!request.lead || !request.lead.email) {
      return winston.debug("The lead object is undefined or has empty email");
    }

    Project.findOne({_id: projectid, status: 100}).select("+settings").exec(function(err, project){
      if (err) {
        return winston.error(err);
      }
  
      if (!project) {
       return winston.warn("Project not found", projectid);
      } 

      // if (project.settings && project.settings.email && project.settings.email.notification && project.settings.email.notification.conversation && project.settings.email.notification.conversation.offline && project.settings.email.notification.conversation.offline.blocked == true ) {
      //   return winston.info("RequestNotification offline email notification for the project with id : " + projectid + " for  the conversations is blocked");
      // }
  

      // if (project.settings && project.settings.email && project.settings.email.notification && project.settings.email.notification.conversation && project.settings.email.notification.conversation.offline && project.settings.email.notification.conversation.offline.enabled == false ) {
      //   return winston.info("RequestNotification offline email notification for the project with id : " + projectid + " for the offline conversation is disabled");
      // }
    emailService.sendEmailChannelTakingNotification(request.lead.email, request, project);
  

    });

  } catch(e) {
    winston.error("Error sending email", {error:e, projectid:projectid, message:message});
  }
}





sendUserEmail(projectid, message) {
  try {

    if (!message.request) {
      return winston.debug("This is a direct message");
    }

    if (!message.request.lead || !message.request.lead.email) {
      return winston.debug("The lead object is undefined or has empty email");
    }

    Project.findOne({_id: projectid, status: 100}).select("+settings").exec(function(err, project){
      if (err) {
        return winston.error(err);
      }
  
      if (!project) {
       return winston.warn("Project not found", projectid);
      } 

      if (project.settings && project.settings.email && project.settings.email.notification && project.settings.email.notification.conversation && project.settings.email.notification.conversation.offline && project.settings.email.notification.conversation.offline.blocked == true ) {
        return winston.info("RequestNotification offline email notification for the project with id : " + projectid + " for  the conversations is blocked");
      }
  

      if (project.settings && project.settings.email && project.settings.email.notification && project.settings.email.notification.conversation && project.settings.email.notification.conversation.offline && project.settings.email.notification.conversation.offline.enabled == false ) {
        return winston.info("RequestNotification offline email notification for the project with id : " + projectid + " for the offline conversation is disabled");
      }



        var recipient = message.request.lead.lead_id;
        winston.debug("recipient:"+ recipient);

        var isObjectId = mongoose.Types.ObjectId.isValid(recipient);
        winston.debug("isObjectId:"+ isObjectId);

        var queryProjectUser ={ id_project: projectid, status: "active"};

        
        if (isObjectId) {          
          queryProjectUser.id_user = recipient
        }else {
          queryProjectUser.uuid_user = recipient
        }
        winston.debug("queryProjectUser", queryProjectUser);

        
        Project_user.findOne( queryProjectUser)
        .exec(function (err, project_user) {

          winston.debug("project_user", project_user);

          if (!project_user) {
            return winston.warn("Project_user not found with query ", queryProjectUser);
          }
         
          if (!project_user.presence || (project_user.presence && project_user.presence.status === "offline")) {

             //send email to lead
            return Lead.findOne({lead_id: recipient}, function(err, lead){
              winston.debug("lead", lead);     //TODO  lead  is already present in request.lead
              if (lead && lead.email) {
                  winston.debug("sending user email to  "+ lead.email);

                  var signOptions = {
                    issuer:  'https://rollout.com',
                    subject:  'guest',
                    audience:  'https://rollout.com',
                    jwtid: uuidv4()        
                  };

                  let userAnonym = {_id: recipient, firstname: lead.fullname, lastname: lead.fullname, email: lead.email, attributes: lead.attributes};
                  winston.debug("userAnonym  ",userAnonym);

        
                  var token = jwt.sign(userAnonym, configSecret, signOptions);
                  winston.debug("token  "+token);

                  var sourcePage = widgetTestLocation + "?rollout_projectid=" 
                  + projectid + "&project_name="+encodeURIComponent(project.name)                   

                  if (message.request.sourcePage) {
                    sourcePage = message.request.sourcePage;                    
                  }
                  
                  if (sourcePage && sourcePage.indexOf("?")===-1) {
                    sourcePage = sourcePage + "?";                   
                  }

                  sourcePage = sourcePage  
                              + "&rollout_recipientId="+message.request.request_id 
                              + "&rollout_isOpen=true";

                  sourcePage = apiUrl + "/urls/redirect?path=" + encodeURIComponent(sourcePage)

                  winston.debug("sourcePage  "+sourcePage);

                  var tokenQueryString;
                  if(sourcePage && sourcePage.indexOf('?')>-1) {  //controllo superfluo visto che lo metto prima? ma lascio comunque per indipendenza
                    tokenQueryString =  encodeURIComponent("&rollout_jwt=JWT "+token)
                  }else {
                    tokenQueryString =  encodeURIComponent("?rollout_jwt=JWT "+token);
                  }
                  winston.debug("tokenQueryString:  "+tokenQueryString);
                  
                  emailService.sendNewMessageNotification(lead.email, message, project, tokenQueryString, sourcePage);
              } 
                
            });

          }

        });       


    });

  } catch(e) {
    winston.error("Error sending email", {error:e, projectid:projectid, message:message});
  }
}

sendAgentEmail(projectid, savedRequest) {
    // send email
    try {
   
   
    Project.findOne({_id: projectid, status: 100}).select("+settings").exec( async function(err, project){
       if (err) {
         return winston.error(err);
       }
   
       if (!project) {
        return winston.warn("Project not found", projectid);
       } else {
         
          winston.debug("project", project);            

          if (project.settings && project.settings.email && project.settings.email.notification && project.settings.email.notification.conversation && project.settings.email.notification.conversation.blocked == true ) {
            return winston.verbose("RequestNotification email notification for the project with id : " + projectid + " for all the conversations is blocked");
          }

          winston.debug("savedRequest: " + JSON.stringify(savedRequest));

              // TODO fare il controllo anche sul dipartimento con modalità assigned o pooled
                 if (savedRequest.status==RequestConstants.UNASSIGNED) { //POOLED

                  if (project.settings && project.settings.email && project.settings.email.notification && project.settings.email.notification.conversation && project.settings.email.notification.conversation.pooled == false ) {
                    return winston.info("RequestNotification email notification for the project with id : " + projectid + " for the pooled conversation is disabled");
                  }
                  if (!savedRequest.snapshot) {
                    return winston.warn("RequestNotification savedRequest.snapshot is null :(. You are closing an old request?");
                  }



                  var snapshotAgents = savedRequest; //riassegno varibile cosi nn cambio righe successive

                  


                  // winston.info("savedRequest.snapshot.agents", savedRequest.snapshot.agents);
                  // agents è selected false quindi nn va sicuro
                  if (!snapshotAgents.snapshot.agents) {
                    //return winston.warn("RequestNotification snapshotAgents.snapshot.agents is null :(. You are closing an old request?", savedRequest);

                  // agents già c'è in quanto viene creato con departmentService.getOperator nella request.create ma nn c'è per request.participants.update
                      snapshotAgents = await Request.findById(savedRequest.id).select({"snapshot":1}).exec();
                      winston.debug('load snapshotAgents with Request.findById ');                              
                  }
                  winston.debug('snapshotAgents', snapshotAgents);                              

                  if (!snapshotAgents.snapshot.agents) {
                    return winston.warn("RequestNotification snapshotAgents.snapshot.agents is null :(. You are closing an old request?", savedRequest);
                  }

                  //  var allAgents = savedRequest.agents;
                   var allAgents = snapshotAgents.snapshot.agents;
            
                  // //  var allAgents = savedRequest.agents;
                  //  var allAgents = savedRequest.snapshot.agents;
                  // // winston.debug("allAgents", allAgents);
   
                  allAgents.forEach(project_user => {
                  //  winston.debug("project_user", project_user); //DON'T UNCOMMENT THIS. OTHERWISE this.agents.filter of models/request.js:availableAgentsCount has .filter not found.
   

                  var userid = project_user.id_user;
                  
                   if (project_user.settings && project_user.settings.email && project_user.settings.email.notification && project_user.settings.email.notification.conversation && project_user.settings.email.notification.conversation.pooled == false ) {
                     return winston.verbose("RequestNotification email notification for the user with id " +  userid+ " the pooled conversation is disabled");
                   }                  
                    
                     User.findOne({_id: userid , status: 100})
                      //@DISABLED_CACHE .cache(cacheUtil.defaultTTL, "users:id:"+userid)
                      .exec(function (err, user) {
                       if (err) {
                       //  winston.debug(err);
                       }
                       if (!user) {
                        winston.warn("User not found", userid);
                       } else {
                         winston.verbose("Sending sendNewPooledRequestNotification to user with email: "+ user.email);
                         if (user.emailverified) {
                           emailService.sendNewPooledRequestNotification(user.email, savedRequest, project);
                         }else {
                           winston.verbose("User email not verified", user.email);
                         }
                       }
                     });
   
                     
                   });
   
                   }

                   // TODO fare il controllo anche sul dipartimento con modalità assigned o pooled
                   else if (savedRequest.status==RequestConstants.ASSIGNED) { //ASSIGNED

                    if (project.settings && project.settings.email && project.settings.email.notification && project.settings.email.notification.conversation && project.settings.email.notification.conversation.assigned == false ) {
                      return winston.verbose("RequestNotification email notification for the project with id : " + projectid + " for the assigned conversation is disabled");
                    }


                    var assignedId = savedRequest.participants[0];

                    //  winston.info("assignedId1:"+ assignedId);

                    //  if (!assignedId) {
                    //    console.log("attention90", savedRequest);
                    //  }


                    
                    Project_user.findOne( { id_user:assignedId, id_project: projectid, status: "active"}) 
                    .exec(function (err, project_user) {
                      
                      // botprefix
                      if (assignedId.startsWith("bot_")) {
                        return ;
                      }
                      
                       if (err) {
                        return winston.error("RequestNotification email notification error getting project_user", err);
                       }
                        winston.debug("project_user notification", project_user);
                        if (project_user && project_user.settings && project_user.settings.email && project_user.settings.email.notification && project_user.settings.email.notification.conversation && project_user.settings.email.notification.conversation.assigned &&  project_user.settings.email.notification.conversation.assigned.toyou == false ) {
                          return winston.info("RequestNotification email notification for the user with id : " + assignedId + " for the pooled conversation is disabled");
                        }

                        
      
                        if (!project_user) {
                          return winston.warn("RequestNotification email notification for the user with id : " + assignedId + " not found project_user");
                        }
                        User.findOne({_id: assignedId, status: 100})
                          //@DISABLED_CACHE .cache(cacheUtil.defaultTTL, "users:id:"+assignedId)
                          .exec(function (err, user) {
                          if (err) {
                            winston.error("Error sending email to " + savedRequest.participants[0], err);
                          }
                          if (!user) {
                            winston.warn("User not found",  savedRequest.participants[0]);
                          } else {
                            winston.verbose("Sending sendNewAssignedRequestNotification to user with email", user.email);
                            //  if (user.emailverified) {    enable it?     send anyway to improve engagment for new account    
                            
                            
                            // var signOptions = {
                            //   issuer:  'https://rollout.com',
                            //   subject:  'user',
                            //   audience:  'https://rollout.com',
                            //   jwtid: uuidv4()        
                            // };
          
                            // let userObject = {_id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email, attributes: user.attributes};
                            // winston.debug("userObject  ",userObject);
          
                  
                            // var agentToken = jwt.sign(userObject, configSecret, signOptions);
                            // winston.debug("agentToken  "+agentToken);

                            


                            emailService.sendNewAssignedRequestNotification(user.email, savedRequest, project);
                            //  }
                          }
                        });

                      });

                   }



                   else {
                    return winston.debug("Other states");
                   }
   
   
         
         }
   
   });
   
   } catch (e) {
     winston.warn("Error sending email", {error:e, projectid:projectid, savedRequest:savedRequest}); //it's better to view error email at this stage
   }
   //end send email
   
   }






   sendTranscriptByEmail(sendTo, request_id, id_project, project) {
    return new Promise(function (resolve, reject) {
      return Request.findOne({request_id: request_id, id_project: id_project})
      .populate('department')
      // .cache(cacheUtil.defaultTTL, "/"+id_project+"/requests/request_id/populate/department/"+request_id)
      .exec(function(err, request) { 
      if (err){
        winston.error(err);
        return reject(err);
      }
      if (!request) {
        winston.error("Request not found for request_id "+ request_id + " and id_project " + id_project);
        return reject("Request not found for request_id "+ request_id  + " and id_project " + id_project);
      }
      


      return Message.find({"recipient": request_id, id_project : id_project})
        .sort({createdAt: 'asc'})
        .exec(function(err, messages) { 
        if (err) {
          return res.status(500).send({success: false, msg: 'Error getting messages.'});
        }

        if(!messages){
          return reject(err);
        }

      

        emailService.sendRequestTranscript(sendTo, messages, request, project);
        winston.verbose("sendTranscriptByEmail sent");
        return resolve({sendTo: sendTo, messages: messages, request: request});

      
      });

      });
    });
  }
   
   
}
 
 
 
 
var requestNotification = new RequestNotification();


module.exports = requestNotification;