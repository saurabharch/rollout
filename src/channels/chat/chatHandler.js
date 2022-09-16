
const messageEvent = require('../../event/messageEvent');
const authEvent = require('../../event/authEvent');
const botEvent = require('../../event/botEvent');
const requestEvent = require('../../event/requestEvent');
const groupEvent = require('../../event/groupEvent');
const chatEvent = require('./chatEvent');
const leadEvent = require('../../event/leadEvent');

var messageService = require('../../services/messageService');
var MessageConstants = require("../../model/messageConstants");
var ChannelConstants = require("../../model/channelConstants");
var winston = require('../../../config/winston');
var Request = require("../../model/request");
var chatConfig = require('./chatConfig');
var chat = require('./chatClient');





const MaskData = require("maskdata");

const maskPasswordOptions = {
    // Character to mask the data. default value is '*'
    maskWith : "*",
    //Should be positive Integer
    // If the starting 'n' digits needs to be unmasked
    // Default value is 4
    unmaskedStartDigits: 3, 
    
    // Should be positive Integer
    //If the ending 'n' digits needs to be unmasked
    // Default value is 1
    unmaskedEndDigits: 2
  };




// var chatUtil = require('./chatUtil');
// var rolloutUtil = require('./rollout-util');

var adminToken =  process.env.CHAT_ADMIN_TOKEN || chatConfig.adminToken;

const masked_adminToken = MaskData.maskPhone(adminToken, maskPasswordOptions);

winston.info('ChatHandler adminToken: '+ masked_adminToken);




class ChatHandler {

 
    typing(message, timestamp) {
        return new Promise(function (resolve, reject) {

            //no typing for subtype info
            if (message.attributes && message.attributes.subtype && message.attributes.subtype==='info') {
                return resolve();
            }else {
                chat.conversations.typing(message.recipient, message.sender, message.text, timestamp).finally(function() {
                    return resolve();
                });
            }
            

        });
    }


    listen() {

        var that = this;       
       
        winston.debug("ChatHandler listener start ");
        

        if (process.env.SYNC_ROLLOUT_GROUPS !=="true") {
            winston.info("Sync Tiledesk to chat groups disabled");
            // return; questo distrugge il tread. attento non lo mettere +
        }

        
      
        // su projectUser create e update
        authEvent.on('user.signup', function(userData) {
            var firstName = userData.savedUser.firstname;
            var lastName = userData.savedUser.lastname;
            var email = userData.savedUser.email;
            var current_user = userData.savedUser.id;

            setImmediate(() => {
                winston.debug("ChatHandler on user.signup ",  userData);

                chat.auth.setAdminToken(adminToken);

                // create: function(firstname, lastname, email, current_user){
                chat.contacts.create(firstName, lastName, email, current_user).then(function(data) {
                    winston.verbose("chat contact created: " + JSON.stringify(data));      
                    chatEvent.emit('contact.create', data);                                          
                }).catch(function(err) {
                    winston.error("Error creating chat contact ", err);
                    chatEvent.emit('contact.create.error', err);
                });

            });
        });


        authEvent.on('user.update', function(userData) {
            var firstName = userData.updatedUser.firstname;
            var lastName = userData.updatedUser.lastname;            
            var current_user = userData.updatedUser.id;

            setImmediate(() => {
                winston.debug("ChatHandler on user.update ",  userData);

                chat.auth.setAdminToken(adminToken);

                // update: function(firstname, lastname, current_user){
                chat.contacts.update(firstName, lastName, current_user).then(function(data) {
                    winston.verbose("chat contact updated: " + JSON.stringify(data));      
                    chatEvent.emit('contact.update', data);                                          
                }).catch(function(err) {
                    winston.error("Error updating chat contact ", err);
                    chatEvent.emit('contact.update.error', err);
                });

            });
        });


        botEvent.on('faqbot.create', function(bot) {
            var firstName = bot.name;
            var lastName = "";
            var email = "";
            // botprefix
            var current_user = "bot_"+bot.id;

            setImmediate(() => {
                winston.debug("ChatHandler on faqbot.create ",  bot);

                chat.auth.setAdminToken(adminToken);

                // create: function(firstname, lastname, email, current_user){
                chat.contacts.create(firstName, lastName, email, current_user).then(function(data) {                    
                    winston.verbose("chat contact created: " + JSON.stringify(data));         
                    chatEvent.emit('contact.create', data);                                          
                }).catch(function(err) {
                    winston.error("Error creating chat contact ", err);
                    chatEvent.emit('contact.create.error', err);
                });

            });
        });



        botEvent.on('faqbot.update', function(bot) {
            var firstName = bot.name;
            var lastName = "";
            // botprefix
            var current_user = "bot_"+bot.id;

            setImmediate(() => {
                winston.debug("ChatHandler on faqbot.create ",  bot);

                chat.auth.setAdminToken(adminToken);

               // update: function(firstname, lastname, current_user){
                chat.contacts.update(firstName, lastName, current_user).then(function(data) {
                    winston.verbose("chat contact updated: " + JSON.stringify(data));      
                    chatEvent.emit('contact.update', data);                                          
                }).catch(function(err) {
                    winston.error("Error updating chat contact ", err);
                    chatEvent.emit('contact.update.error', err);
                });

            });
        });


    // quando passa da lead temp a default aggiorna tutti va bene?        

         leadEvent.on('lead.update', function(lead) {
            //  non sembra funzionare chiedi a Dario dove prende le info
            setImmediate(() => {
                winston.debug("ChatHandler on lead.update ",  lead);

                //  TODO AGGIORNA SOLO SE PASSA DA GUEST A ALTRO??
                Request.find({lead: lead._id, id_project: lead.id_project}, function(err, requests) {

                    if (err) {
                        winston.error("Error getting request by lead", err);
                        return 0;
                    }
                    if (!requests || (requests && requests.length==0)) {
                        winston.warn("No request found for lead id " +lead._id );
                        return 0;
                    }
                    
                    chat.auth.setAdminToken(adminToken);

                    requests.forEach(function(request) {
                        if (request.channelOutbound.name === ChannelConstants.CHAT) {

                            winston.verbose("ChatHandler lead.update for request ",  request);
                            
                            var groupName = lead.fullname;
                            if (request.subject) {
                                groupName=request.subject;
                            }
                            // update: function(name, owner, attributes, group_id){

                            chat.groups.update(groupName, undefined, undefined, request.request_id).then(function(data) {
                                winston.verbose("chat group updated for lead.update: " + JSON.stringify(data));      
                                chatEvent.emit('group.update', data);                                          
                            }).catch(function(err) {
                                winston.error("Error updating chat group for lead.update", err);
                                chatEvent.emit('group.update.error', err);
                            });

                             // updateAttributes: function(attributes, group_id){
                                 var gattributes = {userFullname:lead.fullname, userEmail: lead.email }
                                //  qui1
                            chat.groups.updateAttributes(gattributes, request.request_id).then(function(data) {
                                winston.verbose("Chat group gattributes for lead.update updated: " + JSON.stringify(data));      
                                chatEvent.emit('group.update', data);        
                                chatEvent.emit('group.attributes.update', data);                                          
                            }).catch(function(err) {
                                winston.error("Error updating chat gattributes for lead.update group ", err);
                                chatEvent.emit('group.attributes.update.error', err);
                            });


                        }
                    })
                  
                });

              
            });
        });



       

        messageEvent.on('message.sending', function(message) {

            // setImmediate(() => {
                // TODO perche nn c'è setImmedite? per performace


                    winston.verbose("ChatSender on message.sending ",  message);
                   
                   if (message && 
                    message.status === MessageConstants.CHAT_MESSAGE_STATUS.SENDING &&
                    message.channel_type ==  MessageConstants.CHANNEL_TYPE.GROUP &&
                    message.request && 
                    message.request.channelOutbound.name == ChannelConstants.CHAT) { //here only request.channelOutbound is important because chathandler is for outgoing messages( from Tiledesk to agents clients)

                    
                        chat.auth.setAdminToken(adminToken);


                        //chat.conversations.typing(message.recipient, message.sender, message.text, new Date()).finally(function() {
                        return that.typing(message,new Date() ).then(function() {
                       

                        let attributes = message.attributes;

                        if (!attributes) attributes = {};
                        
                        attributes['tiledesk_message_id'] = message._id;

                        attributes['projectId'] = message.id_project; //TODO not used. used by ionic to open request detail ???
                        
                       


                        winston.verbose("chatSender sending message.sending ",  message);

                        // rolloutUtil.getParsedMessage().then(function(messageData) {
                        //     message = messageData;

                            // doent'work must merge older field with new message = chatUtil.parseReply(message.text);

                            // sendToGroup: function(sender_fullname, recipient_id, recipient_fullname, text, sender_id, attributes, type, metadata, timestamp){


                            var timestamp = Date.now();
                            // var timestamp = undefined;
                            if (message.attributes && message.attributes.clienttimestamp) {
                                timestamp = message.attributes.clienttimestamp;
                            }

                            var recipient_fullname = "Guest"; 
                            // TODO qui va message.recipient_fullname ma nn c'è
                            if (message.request && message.request.lead && message.request.lead.fullname) {
                                recipient_fullname = message.request.lead.fullname;
                            }
                            if (message.request && message.request.subject ) {
                                recipient_fullname = message.request.subject;
                            }

                            /*
                            const parsedReply = tiledeskUtil.parseReply(message.text);
                            winston.info("Chat sendToGroup parsedMessage " + JSON.stringify(parsedReply));

                            // message = {...message, ...parsedReply.message };
                            // merge(message, parsedReply.message );

                            if (parsedReply.message.text) {
                                message.text = parsedReply.message.text;
                            }
                            if (parsedReply.message.type) {
                                message.type = parsedReply.message.type;
                            }
                            if (parsedReply.message.type) {
                                message.metadata = parsedReply.message.metadata;
                            }
                            
                            // var msg_attributes = {...message.attributes, ...parsedReply.message.attributes };
                            if (parsedReply.message && parsedReply.message.attributes) {
                                for(const [key, value] of Object.entries(parsedReply.message.attributes)) {
                                    attributes[key] = value
                                }
                            }    
                            */   
                         
                           return  chat.messages.sendToGroup(message.senderFullname,     message.recipient, 
                                recipient_fullname, message.text, message.sender, attributes, message.type, message.metadata, timestamp)
                                        .then(function(data){
                                            winston.verbose("chatSender sendToGroup sent: "+ JSON.stringify(data));
                                    

                                            // chat.conversations.stopTyping(message.recipient,message.sender);
    
                                            chatEvent.emit('message.sent', data);
    
                                                messageService.changeStatus(message._id, MessageConstants.CHAT_MESSAGE_STATUS.DELIVERED) .then(function(upMessage){
                                                    winston.debug("chat message sent ", upMessage.toObject());                                        
                                                }).catch(function(err) {
                                                    winston.error("Error chat message sent with id: "+message._id, err);                                        
                                                });
    
                                }).catch(function(err) {
                                    winston.error("chat sendToGroup err", err);
                                    chatEvent.emit('message.sent.error', err);
                                });

                            });
                        
                        // });
                    }
                    else if (message &&
                         message.status === MessageConstants.CHAT_MESSAGE_STATUS.SENDING && 
                         message.channel_type ==  MessageConstants.CHANNEL_TYPE.DIRECT &&
                         message.channel.name == ChannelConstants.CHAT) {
                        
                            // winston.warn("chatSender this is a direct message. Unimplemented method", message);

                            chat.auth.setAdminToken(adminToken);

                            // send: function(sender_fullname, recipient_id, recipient_fullname, text, sender_id, attributes, type, metadata){
                           return  chat.messages.send(message.senderFullname,     message.recipient, 
                            message.recipientFullname, message.text, message.sender, message.attributes, message.type, message.metadata)
                                    .then(function(data){
                                        winston.verbose("chatSender send sent: "+ JSON.stringify(data));
                                

                                        // chat.conversations.stopTyping(message.recipient,message.sender);

                                        chatEvent.emit('message.sent', data);

                                            messageService.changeStatus(message._id, MessageConstants.CHAT_MESSAGE_STATUS.DELIVERED) .then(function(upMessage){
                                                winston.debug("chat message sent ", upMessage.toObject());                                        
                                            }).catch(function(err) {
                                                winston.error("Error chat message sent with id: "+message._id, err);                                        
                                            });

                            }).catch(function(err) {
                                winston.error("chat send direct err", err);
                                chatEvent.emit('message.sent.error', err);
                            });

                            

                    } 
                    
                    else if (message &&
                        message.status === MessageConstants.CHAT_MESSAGE_STATUS.SENDING && 
                        message.channel_type ==  MessageConstants.CHANNEL_TYPE.GROUP &&
                        message.channel.name == ChannelConstants.CHAT) {
                       
                           // winston.warn("chatSender this is a group message. Unimplemented method", message);

                           chat.auth.setAdminToken(adminToken);

                           var timestamp = Date.now();
                           // var timestamp = undefined;
                           if (message.attributes && message.attributes.clienttimestamp) {
                               timestamp = message.attributes.clienttimestamp;
                           }


                           return  chat.messages.sendToGroup(message.senderFullname,     message.recipient, 
                            message.recipientFullname, message.text, message.sender, message.attributes, message.type, message.metadata, timestamp)                         
                                   .then(function(data){
                                       winston.verbose("chatSender send sent: "+ JSON.stringify(data));
                               

                                       // chat.conversations.stopTyping(message.recipient,message.sender);

                                       chatEvent.emit('message.sent', data);

                                           messageService.changeStatus(message._id, MessageConstants.CHAT_MESSAGE_STATUS.DELIVERED) .then(function(upMessage){
                                               winston.debug("chat message sent ", upMessage.toObject());                                        
                                           }).catch(function(err) {
                                               winston.error("Error chat message sent with id: "+message._id, err);                                        
                                           });

                           }).catch(function(err) {
                               winston.error("chat sendToGroup err", err);
                               chatEvent.emit('message.sent.error', err);
                           });

                           

                   } else {
                        winston.error("chatSender this is not a group o direct message", message);
                        return;
                    }
                // });
            });


            requestEvent.on('request.attributes.update',  function(request) {          

                setImmediate(() => {
                    if (request.channelOutbound.name === ChannelConstants.CHAT) {

                        chat.auth.setAdminToken(adminToken);

                        var gattributes = request.attributes;
                        // qui1
                        chat.groups.updateAttributes(gattributes, request.request_id).then(function(data) {
                            winston.verbose("chat group gattributes for request.attributes.update updated: " + JSON.stringify(data));      
                            chatEvent.emit('group.update', data);        
                            chatEvent.emit('group.attributes.update', data);                                          
                        }).catch(function(err) {
                            winston.error("Error updating chat gattributes for request.attributes.update group ", err);
                            chatEvent.emit('group.attributes.update.error', err);
                        });

                    }
                });
            });

            
            //   not used now. Before used by ionic
            // requestEvent.on('request.update',  function(request) {          

            //     setImmediate(() => {
            //         if (request.channelOutbound.name === ChannelConstants.CHAT) {

            //             chat.auth.setAdminToken(adminToken);

            //               // https://stackoverflow.com/questions/42310950/handling-undefined-values-with-firebase/42315610                        
            //             //   var requestWithoutUndefined = JSON.parse(JSON.stringify(request, function(k, v) {
            //             //     if (v === undefined) { return null; } return v; 
            //             //  }));

            //             // var gattributes = { "_request":requestWithoutUndefined};

            //             // qui1
            //             chat.groups.updateAttributes(gattributes, request.request_id).then(function(data) {
            //                 winston.verbose("chat group gattributes for request.update updated: " +  JSON.stringify(data));      
            //                 chatEvent.emit('group.update', data);        
            //                 chatEvent.emit('group.attributes.update', data);                                          
            //             }).catch(function(err) {
            //                 winston.error("Error updating chat gattributes for request.update group ", err);
            //                 chatEvent.emit('group.attributes.update.error', err);
            //             });

            //         }
            //     });
            // });

            requestEvent.on('request.create',  function(request) {          

                winston.debug("chatHandler requestEvent request.create called" , request);
                // setImmediate(() => {
// perche nn c'è setImmedite? per performace
                    if (request.channelOutbound.name === ChannelConstants.CHAT) {

                        chat.auth.setAdminToken(adminToken);

                        

                        // let requestObj = request.toObject();
                        let requestObj = request.toJSON();
                        
                        winston.verbose("creating chat group for request with id: " + requestObj._id);

                        // winston.info("requestObj.participants: "+ Object.prototype.toString.call(requestObj.participants));
                        winston.debug("requestObj.participants: "+ JSON.stringify(requestObj.participants));
                        
                        let members = requestObj.participants;
                        // var members = reqParticipantArray;

                        members.push("system");
                        if (request.lead) {
                            // lead_id used. Change it?
                            members.push(request.lead.lead_id);
                        }
                        
                        
                        // let membersArray = JSON.parse(JSON.stringify(members));
                        // winston.info("membersArray", membersArray);

                        var gAttributes = request.attributes || {};
                        // problema requester_id
                        gAttributes["requester_id"] = request.requester_id;
                    
                       
                        gAttributes['projectId'] = request.id_project; //used by ionic to open request detail 

                        if (request.lead) {
                            gAttributes['userFullname'] = request.lead.fullname; //used by ionic to open request detail 
                            gAttributes['userEmail'] = request.lead.email; //used by ionic to open request detail 
                            // TOOD is it necessary? 
                            // lead_id used. Change it?
                            gAttributes['senderAuthInfo'] = {authType: "USER", authVar: {uid:request.lead.lead_id}}; //used by ionic otherwise ionic dont show userFullname in the participants panel
                        }
                        // TODO ionic dont show attributes panel if attributes.client is empty. bug?
                        gAttributes['client'] = request.userAgent || 'n.d.'; //used by ionic to open request detail 
                        if (request.department) {
                            gAttributes['departmentId'] = request.department._id; //used by ionic to open request detail 
                            gAttributes['departmentName'] = request.department.name; //used by ionic to open request detail 
                        }                        
                        gAttributes['sourcePage'] = request.sourcePage; //used by ionic to open request detail 

                        
                        // https://stackoverflow.com/questions/42310950/handling-undefined-values-with-firebase/42315610

                        //   not used now. Before used by ionic
                        // var requestWithoutUndefined = JSON.parse(JSON.stringify(request, function(k, v) {
                        //     if (v === undefined) { return null; } return v; 
                        //  }));
                        //  gAttributes['_request'] = requestWithoutUndefined; //used by ionic to open request detail 
                        
                        


 
                        winston.debug("chat group create gAttributes: ",gAttributes);  

                        var groupId = request.request_id;

                        var group_name = "Guest"; 

                        if (request.lead && request.lead.fullname) {
                            group_name = request.lead.fullname;
                        }
                        if (request.subject) {
                            group_name = request.subject;
                        }
                        //TODO racecondition?
                        return chat.groups.create(group_name, members, gAttributes, groupId).then(function(data) {
                                winston.verbose("chat group created: " + JSON.stringify(data));      
                                requestEvent.emit('request.support_group.created', request);

                                chatEvent.emit('group.create', data);      
                            }).catch(function(err) {
                                winston.error("Error creating chat group ", err);

                                requestEvent.emit('request.support_group.created.error', request);

                                chatEvent.emit('group.create.error', err);
                            });


                    }
                // });
            });
    

            
            requestEvent.on('request.close',  function(request) {          

                winston.debug("chatHandler requestEvent request.close called" , request);

                setImmediate(() => {
                    if (request.channelOutbound.name === ChannelConstants.CHAT) {

                        chat.auth.setAdminToken(adminToken);                      

                        winston.verbose("chatSender archiving conversations for ",request.participants);

                       //iterate request.participant and archive conversation
                       request.participants.forEach(function(participant,index) {

                        winston.verbose("chatSender archiving conversation: " + request.request_id + "for " + participant);

                            chat.conversations.archive(request.request_id, participant)
                                        .then(function(data){
                                            winston.verbose("chat conversation archived result "+ JSON.stringify(data));
                                    
                                            chatEvent.emit('conversation.archived', data);                                               

                                }).catch(function(err) {
                                    winston.error("chat archived err", err);
                                    chatEvent.emit('conversation.archived.error', err);
                                });
                       });

                    //    archive: function(recipient_id, user_id){
                       chat.conversations.archive(request.request_id, "system")
                       .then(function(data){
                           winston.verbose("chat archived for system"+ JSON.stringify(data));
                   
                           chatEvent.emit('conversation.archived', data);                                               

                        }).catch(function(err) {
                            winston.error("chat archived  for system err", err);
                            chatEvent.emit('conversation.archived.error', err);
                        });

                        
                        //  request.lead can be undefined because some test case uses the old deprecated method requestService.createWithId.
                        if (request.lead) {
                            // lead_id used. Change it?
                            chat.conversations.archive(request.request_id, request.lead.lead_id)  //                        chat.conversations.archive(request.request_id, request.requester_id)<-desnt'archive

                            .then(function(data){
                                winston.verbose("chat archived for request.lead.lead_id"+ JSON.stringify(data));
                        
                                chatEvent.emit('conversation.archived', data);                                               
     
                             }).catch(function(err) {
                                 winston.error("chat archived for request.lead.lead_id err", err);
                                 chatEvent.emit('conversation.archived.error', err);
                             });
                        }
                        
                    }
                });
            });
            
            

             requestEvent.on('request.participants.update',  function(data) {      
                 
                winston.debug("chatHandler requestEvent request.participants.update called" , data);

                   let request = data.request;
                   let removedParticipants = data.removedParticipants;
                

                setImmediate(() => {
                    if (request.channelOutbound.name === ChannelConstants.CHAT) {

                        chat.auth.setAdminToken(adminToken);

                        

                     
                        let requestObj = request.toJSON();
                        
                        winston.verbose("setting chat group for request.participants.update for request with id: " + requestObj._id);
                    
                        var groupId = request.request_id;

                        let members = [];
                        
                        members.push("system");

                        // qui errore participants sembra 0,1 object ???
                        request.participants.forEach(function(participant,index) {
                            members.push(participant);
                        });
                        // requestObj.participants;
                        // var members = reqParticipantArray;

                        if (request.lead) {
                            // lead_id used. Change it?
                            members.push(request.lead.lead_id);
                        }
                        winston.verbose("chat group with members for request.participants.update: " , members);  

                         //setMembers: function(members, group_id){
                                //racecondition  
                        chat.groups.setMembers(members, groupId).then(function(data) {
                                winston.verbose("chat group set for request.participants.update : " + JSON.stringify(data));      
                                chatEvent.emit('group.setMembers', data);                                          
                            }).catch(function(err) {
                                winston.error("Error setting chat group for request.participants.update ", err);
                                chatEvent.emit('group.setMembers.error', err);
                            });


                        // let oldParticipants = data.beforeRequest.participants;
                        // winston.info("oldParticipants ", oldParticipants);

                        // let newParticipants = data.request.participants;
                        // winston.info("newParticipants ", newParticipants);

                        // var removedParticipants = oldParticipants.filter(d => !newParticipants.includes(d));
                        // winston.info("removedParticipants ", removedParticipants);

                       

                        removedParticipants.forEach(function(removedParticipant) {
                            winston.debug("removedParticipant ", removedParticipant);

                            // archive: function(recipient_id, user_id){
                            //racecondition?low it's not dangerous archive a conversation that doen't exist

                            chat.conversations.archive(request.request_id, removedParticipant)
                            .then(function(data){
                                winston.verbose("chat archived "+ JSON.stringify(data));
                        
                                chatEvent.emit('conversation.archived', data);                                               
        
                                }).catch(function(err) {
                                    winston.error("chat archived err", err);
                                    chatEvent.emit('conversation.archived.error', err);
                                });

                        });
                        



                    }
                });
            });
            
            
               requestEvent.on('request.participants.join',  function(data) {       
                   winston.debug("chatHandler requestEvent request.participants.join called" , data);

                   let request = data.request;
                   let member = data.member;

                setImmediate(() => {
                    if (request.channelOutbound.name === ChannelConstants.CHAT) {

                        chat.auth.setAdminToken(adminToken);

                        

                     
                        // let requestObj = request.toJSON();
                        
                        var groupId = request.request_id;

                        winston.verbose("joining member " + member +" for chat group with request : " + groupId);
                                            
                             //racecondition?

                         //join: function(member_id, group_id){
                        chat.groups.join(member, groupId).then(function(data) {
                                winston.verbose("chat group joined: " + JSON.stringify(data));      
                                chatEvent.emit('group.join', data);                                          
                            }).catch(function(err) {
                                winston.error("Error joining chat group ", err);
                                chatEvent.emit('group.join.error', err);
                            });



                    }
                });
            });
            
            
               requestEvent.on('request.participants.leave',  function(data) {     
                   winston.debug("chatHandler requestEvent request.participants.leave called" , data);

                   let request = data.request;
                   let member = data.member;

                setImmediate(() => {
                    if (request.channelOutbound.name === ChannelConstants.CHAT) {

                        chat.auth.setAdminToken(adminToken);

                     

                     
                        // let requestObj = request.toJSON();
                        
                        var groupId = request.request_id;

                        winston.verbose("leaving " + member +" for chat group for request with id: " + groupId);
                                   
                        //racecondition?
                         //leave: function(member_id, group_id){
                        chat.groups.leave(member, groupId).then(function(data) {
                                winston.verbose("chat group leaved: " + JSON.stringify(data));      
                                chatEvent.emit('group.leave', data);                                          
                            }).catch(function(err) {
                                winston.error("Error leaving chat group ", err);
                                chatEvent.emit('group.leave.error', err);
                            });


                            // anche devi archiviare la conversazione per utente corrente 
                            //racecondition?
                            chat.conversations.archive(request.request_id, member)
                            .then(function(data){
                                winston.verbose("chat archived " + JSON.stringify(data));
                        
                                chatEvent.emit('conversation.archived', data);                                               
     
                             }).catch(function(err) {
                                 winston.error("chat archived err", err);
                                 chatEvent.emit('conversation.archived.error', err);
                             });

                           


                    }
                });
            })
            




            groupEvent.on('group.create',  function(group) {                       

                if (process.env.SYNC_ROLLOUT_GROUPS !=="true") {
                    winston.debug("Sync Tiledesk to chat groups disabled");
                    return;
                }

                winston.verbose("Creating chat group", group);
                
                setImmediate(() => {

                    chat.auth.setAdminToken(adminToken);


                    var groupMembers = group.members;
                    winston.debug("groupMembers ", groupMembers); 
                    
                    var group_id = "group-" + group._id;
                    winston.debug("group_id :" + group_id); 

                    return chat.groups.create(group.name, groupMembers, undefined, group_id).then(function(data) {
                        winston.verbose("chat group created: " + JSON.stringify(data));      
                        // TODO ritorna success anche se 
                        // verbose: chat group created: {"success":false,"err":{"message":"Channel closed","stack":"IllegalOperationError: Channel closed\n    at ConfirmChannel.<anonymous> (/usr/src/app/node_modules/amqplib/lib/channel.js:160:11)\n    at ConfirmChannel.Channel.publish (/usr/src/app/node_modules/amqplib/lib/callback_model.js:171:17)\n    at ConfirmChannel.publish (/usr/src/app/node_modules/amqplib/lib/callback_model.js:301:36)\n    at RolloutApi.publish (/usr/src/app/rolloutApi/index.js:1028:29)\n    at RolloutApi.sendMessageRaw (/usr/src/app/rolloutApi/index.js:762:14)\n    at RolloutApi.sendGroupWelcomeMessage (/usr/src/app/rolloutApi/index.js:205:14)\n    at /usr/src/app/rolloutApi/index.js:99:22\n    at /usr/src/app/rolloutApi/index.js:234:17\n    at /usr/src/app/chatdb/index.js:77:9\n    at executeCallback (/usr/src/app/node_modules/mongodb/lib/operations/execute_operation.js:70:5)\n    at updateCallback (/usr/src/app/node_modules/mongodb/lib/operations/update_one.js:41:3)\n    at /usr/src/app/node_modules/mongodb/lib/operations/update_one.js:24:64\n    at handleCallback (/usr/src/app/node_modules/mongodb/lib/utils.js:128:55)\n    at /usr/src/app/node_modules/mongodb/lib/operations/common_functions.js:378:5\n    at handler (/usr/src/app/node_modules/mongodb/lib/core/sdam/topology.js:913:24)","stackAtStateChange":"Stack capture: Socket error\n    at Connection.C.onSocketError (/usr/src/app/node_modules/amqplib/lib/connection.js:354:13)\n    at Connection.emit (events.js:314:20)\n    at Socket.go (/usr/src/app/node_modules/amqplib/lib/connection.js:481:12)\n    at Socket.emit (events.js:314:20)\n    at emitReadable_ (_stream_readable.js:557:12)\n    at processTicksAndRejections (internal/process/task_queues.js:83:21)"}}
                        chatEvent.emit('group.create', data);                                          
                    }).catch(function(err) {
                        winston.error("Error creating chat group ", err);
                        chatEvent.emit('group.create.error', err);
                    });

                });

             });


             groupEvent.on('group.update',  function(group) {                       

                if (process.env.SYNC_ROLLOUT_GROUPS !=="true") {
                    winston.debug("Sync Tiledesk to chat groups disabled");
                    return;
                }

                winston.verbose("Updating chat group", group);
                
                setImmediate(() => {

                    chat.auth.setAdminToken(adminToken);


                    var groupMembers = group.members;
                    winston.debug("groupMembers ", groupMembers); 
                    
                    var group_id = "group-" + group._id;
                    winston.debug("group_id :" + group_id); 

                            // update: function(name, owner, attributes, group_id){
                    return chat.groups.update(group.name, undefined, undefined, group_id).then(function(data) {
                        winston.verbose("chat group.update updated: " + JSON.stringify(data));      
                        chatEvent.emit('group.update', data);     
                        return chat.groups.setMembers(groupMembers, group_id).then(function(data) {      
                            winston.verbose("chat group.update set: " + JSON.stringify(data));      
                            chatEvent.emit('group.setMembers', data);          
                        }).catch(function(err) {
                            winston.error("Error setMembers chat group.update ", err);
                            chatEvent.emit('group.setMembers.error', err);
                        });                             
                    }).catch(function(err) {
                        winston.error("Error setting chat group.update ", err);
                        chatEvent.emit('group.update.error', err);
                    });

                });

             });





             groupEvent.on('group.delete',  function(group) {                       

                if (process.env.SYNC_ROLLOUT_GROUPS !=="true") {
                    winston.debug("Sync Tiledesk to chat groups disabled");
                    return;
                }

                winston.verbose("Deleting chat group for group.delete", group);
                
                setImmediate(() => {

                    chat.auth.setAdminToken(adminToken);
                  
                    var group_id = "group-" + group._id;
                    winston.debug("group_id :" + group_id); 

                    //Remove members but group remains.

                    return chat.groups.setMembers(["system"], group_id).then(function(data) {      
                        winston.verbose("chat group set for group.delete : " + JSON.stringify(data));      
                        chatEvent.emit('group.setMembers', data);          
                    }).catch(function(err) {
                        winston.error("Error setMembers chat group for group.delete", err);
                        chatEvent.emit('group.setMembers.error', err);
                    });           

                });

             });

    }

    
}

var chatHandler = new ChatHandler();
module.exports = chatHandler;