
var chatConfig = require('./chatConfig');
var Chat = require('@saurabharch/rollout-node-sdk');
var winston = require('../../../config/winston');



var url = process.env.CHAT_URL || chatConfig.url;
var appid = process.env.CHAT_APPID || chatConfig.appid;

winston.info('ChatClient chat.url: '+url );
winston.info('ChatClient chat.appid: '+ appid);

var chat = new Chat({
 url: url,
 appid: appid
 //authurl: process.env.CHAT_AUTH_URL
});

module.exports = chat;
