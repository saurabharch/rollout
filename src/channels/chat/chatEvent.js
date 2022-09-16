const EventEmitter = require('events');

class ChatEvent extends EventEmitter {}

const chatEvent = new ChatEvent();




module.exports = chatEvent;
