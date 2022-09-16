
var winston = require('../../config/winston');


var chatEnabled = process.env.CHAT_ENABLED;
winston.debug("chatEnabled: "+chatEnabled);

var engine = process.env.CHAT_ENGINE;
winston.debug("chat engine: "+engine);


var validtoken = require('../middlewares/valid-token');
var passport = require('passport');
require('../middlewares/passport')(passport);


if (chatEnabled && chatEnabled == "true") {
    winston.info("ChannelManager - Chat channel is enabled");
}else {
    winston.info("ChannelManager Chat channel is disabled. Attention!!");
}

class ChannelManager {

    use(app) {
        var that = this;
        winston.debug("ChannelManager using controllers");

        if (chatEnabled && chatEnabled == "true") {

            var chatWebHook = require('./chat/chatWebHook');
            app.use('/chat/requests',  chatWebHook); //<- TODO cambiare /request in /webhook

            var chatContact = require('./chat/chatContact');
            app.use('/chat/contacts',  chatContact);

            var chatConfigRoute = require('./chat/configRoute');
            app.use('/chat/config',  chatConfigRoute);

            
            if (engine && engine=="firebase") {
                winston.info("ChannelManager - Chat channel engine is firebase");
                var firebaseAuth = require('./chat/firebaseauth');
                app.use('/chat/firebase/auth', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken], firebaseAuth);
            } else { //if (engine && engine=="native") {
                winston.info("ChannelManager - Chat channel engine is native mqtt");
                var nativeAuth = require('./chat/nativeauth');
                app.use('/chat/native/auth', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken], nativeAuth);
            }
            winston.info("ChannelManager - Chat channel routes initialized");
        } else {
            winston.info("ChannelManager - Chat channel routes not initialized.");
        }            

        
    }

    useUnderProjects(app) {

    }

    listen() {
        var that = this;

        if (process.env.NODE_ENV == 'test')  {	
            return winston.info("ChannelManager listener disabled for testing");
        }
        
        if (chatEnabled && chatEnabled == "true") {   
            var chatHandler = require('./chat/chatHandler');         
            chatHandler.listen();
            winston.info("ChannelManager listener started");
        }else {
            winston.info("ChannelManager listener NOT started ");
        }
    }


    
}

var channelManager = new ChannelManager();
module.exports = channelManager;
