const botEvent = require('../../event/botEvent');
var Faq_kb = require("../../model/faq_kb");
var winston = require('../../../config/winston');

var port = process.env.PORT || '5500';

const ROLLBOT_ENDPOINT = process.env.ROLLBOT_ENDPOINT || "http://localhost:" + port+ "/chat/modules/rollbot/";
winston.debug("ROLLBOT_ENDPOINT: " + ROLLBOT_ENDPOINT);

winston.info("Rollbot endpoint: " + ROLLBOT_ENDPOINT);

class Listener {

    listen(config) {

        winston.info('Rollbot Listener listen');
        // winston.debug("config databaseUri: " + config.databaseUri);  
        

        var that = this;

      
        botEvent.on('faqbot.create', function(bot) {
            if (TILEBOT_ENDPOINT) {

                winston.debug('bot.type:'+bot.type); 
                if (bot.type==="rollbot") {

                    winston.debug('qui.type:'+bot.type); 


                    Faq_kb.findByIdAndUpdate(bot.id, {"url":ROLLBOT_ENDPOINT+bot.id}, { new: true, upsert: true }, function (err, savedFaq_kb) {

                    // bot.save(function (err, savedFaq_kb) {
                        if (err) {
                         return winston.error('error saving faqkb rollbot ', err);
                        }
                        winston.verbose('Saved faqkb rolloutbot', savedFaq_kb.toObject());
                    });
                }
            }
        });
        
    }

}

var listener = new Listener();


module.exports = listener;