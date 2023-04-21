'use strict';

const nodemailer = require('nodemailer');
var config = require('../../config/email');
var configGlobal = require('../../config/global');
var winston = require('../../config/winston');
var marked = require('marked');
var handlebars = require('handlebars');
var encode = require('html-entities').encode;

handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

// var options = {};
// handlebars.registerHelper('markdown', markdown(options));

// handlebars.registerHelper('ifCond', function(v1, v2, options) {
//   if(v1 === v2) {
//     return options.fn(this);
//   }
//   return options.inverse(this);
// });


var fs = require('fs');
var appRoot = require('app-root-path');

const MaskData = require("maskdata");

const maskOptions = {
  // Character to mask the data. default value is '*'
  maskWith : "*",
  // If the starting 'n' digits needs to be unmasked
  // Default value is 4
  unmaskedStartDigits : 3, //Should be positive Integer
  //If the ending 'n' digits needs to be unmasked
  // Default value is 1
  unmaskedEndDigits : 3 // Should be positive Integer
  };

// const X_REQUEST_ID_HEADER_KEY = "X-ROLLOUT-REQUEST-ID";
// const X_TICKET_ID_HEADER_KEY = "X-ROLLOUT-TICKET-ID";
// const X_PROJECT_ID_HEADER_KEY = "X-ROLLOUT-PROJECT-ID";

const MESSAGE_ID_DOMAIN = "Rollout.com";

class EmailService {

  constructor() {

    this.enabled = false;
    if (process.env.EMAIL_ENABLED ==="true" || process.env.EMAIL_ENABLED === true ) {
      this.enabled = true;
    }

    winston.info('EmailService enabled: '+ this.enabled);

    this.baseUrl = process.env.EMAIL_BASEURL || config.baseUrl;
    winston.info('EmailService baseUrl: '+ this.baseUrl);
    
    this.apiUrl = process.env.API_URL || configGlobal.apiUrl;
    winston.info('EmailService apiUrl: '+ this.apiUrl);

    this.from = process.env.EMAIL_FROM_ADDRESS || config.from;
    winston.info('EmailService from email: '+ this.from);

    this.bcc = process.env.EMAIL_BCC || config.bcc;
    winston.info('EmailService bcc address: '+ this.bcc);

    this.replyEnabled = config.replyEnabled;
    if (process.env.EMAIL_REPLY_ENABLED  === "true" || process.env.EMAIL_REPLY_ENABLED === true ) {
      this.replyEnabled = true;
    }
    winston.info('EmailService replyEnabled : '+ this.replyEnabled);

    // this is used as fixed reply to url, but this is unused we always return support-group-dynamic
    this.replyTo = process.env.EMAIL_REPLY_TO || config.replyTo;
    winston.info('EmailService replyTo address: '+ this.replyTo);

    this.inboundDomain = process.env.EMAIL_INBOUND_DOMAIN || config.inboundDomain;         
    winston.info('EmailService inboundDomain : '+ this.inboundDomain);
    
    this.inboundDomainDomainWithAt = "@"+this.inboundDomain;
    winston.verbose('EmailService inboundDomainDomainWithAt : '+ this.inboundDomainDomainWithAt);

    this.pass = process.env.EMAIL_PASSWORD;

    var maskedemailPassword;
    if (this.pass) {
      maskedemailPassword = MaskData.maskPhone(this.pass, maskOptions);
    }else {
      maskedemailPassword = this.pass;
    }

    winston.info('EmailService pass: ' + maskedemailPassword);

    this.host = process.env.EMAIL_HOST || config.host;
    winston.info('EmailService host: ' + this.host);

    this.secure  = process.env.EMAIL_SECURE || false;     
    winston.info('EmailService secure: ' + this.secure);

    this.user  = process.env.EMAIL_USERNAME || config.username;
    winston.info('EmailService username: ' + this.user);

    this.port  = process.env.EMAIL_PORT;  //default is 587
    winston.info('EmailService port: ' + this.port);


    this.markdown = process.env.EMAIL_MARKDOWN || true;
    winston.info('EmailService markdown: '+ this.markdown);

    this.headers = {
      // "X-Mailer": "Rollout Mailer",
    }
    winston.info('EmailService headers: ' + JSON.stringify(this.headers));

  }

  readTemplate(templateName, settings) {
    // aggiunsta questo
    var that = this;
    winston.debug('EmailService readTemplate: '+ templateName + '  ' + JSON.stringify(settings)); 
    

      if (settings && settings.email && settings.email.templates) {

       var templates = settings.email.templates;
       winston.debug('EmailService templates: ',templates); 

       var templateDbName = templateName.replace(".html", "");
       winston.debug('EmailService templateDbName: '+templateDbName); 


       var template = templates[templateDbName];
       winston.debug('EmailService template: '+template); 

        if (template) {
        // that.callback(template);
          return new Promise(function (resolve, reject) {
            return resolve(template);
          });
        }else {
          return that.readTemplateFile(templateName);
        }      
      } else {
        return that.readTemplateFile(templateName);
      } 
  }
  readTemplateFile(templateName) {
    // var that = this;
    return new Promise(function (resolve, reject) {
      fs.readFile(appRoot + '/template/email/'+templateName, {encoding: 'utf-8'}, function (err, html) {
          if (err) {
              winston.error('error readTemplateFile getting ', err);
              // callback(err);
              return reject(err);
          }
          else {
              // callback(null, html);
              return resolve(html);
          }
      }); 
    });
};


  getTransport(configEmail) {

    if (configEmail === undefined) {
      configEmail = {
        host: this.host,
        port: this.port, // defaults to 587 if is secure is false or 465 if true
        secure: this.secure,         
        user: this.user,
        pass: this.pass      
      }
      winston.debug("getTransport initialized with default");
    } else {
      winston.verbose("getTransport custom", configEmail);
    }

    winston.debug("getTransport configEmail: "+ JSON.stringify(configEmail));

    let transport = {
      host: configEmail.host,
      port: configEmail.port, // defaults to 587 if is secure is false or 465 if true
      secure: configEmail.secure, 
      auth: {
        user: configEmail.user,
        pass: configEmail.pass
      },

// openssl genrsa -out dkim_private.pem 2048
// openssl rsa -in dkim_private.pem -pubout -outform der 2>/dev/null | openssl base64 -A
// -> 
// v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAunT2EopDAYnHwAOHd33KhlzjUXJfhmA+fK+cG85i9Pm33oyv1NoGrOynsni0PO6j7oRxxHqs6EMDOw4I/Q0C7aWn20oBomJZehTOkCV2xpuPKESiRktCe/MIZqbkRdypis4jSkFfFFkBHwgkAg5tb11E9elJap0ed/lN5/XlpGedqoypKxp+nEabgYO5mBMMNKRvbHx0eQttRYyIaNkTuMbAaqs4y3TkHOpGvZTJsvUonVMGAstSCfUmXnjF38aKpgyTausTSsxHbaxh3ieUB4ex+svnvsJ4Uh5Skklr+bxLVEHeJN55rxmV67ytLg5XCRWqdKIcJHFvSlm2YwJfcwIDAQABMacAL
// testdkim._domainkey.Rollout.com. 86400 IN TXT "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAunT2EopDAYnHwAOHd33KhlzjUXJfhmA+fK+cG85i9Pm33oyv1NoGrOynsni0PO6j7oRxxHqs6EMDOw4I/Q0C7aWn20oBomJZehTOkCV2xpuPKESiRktCe/MIZqbkRdypis4jSkFfFFkBHwgkAg5tb11E9elJap0ed/lN5/XlpGedqoypKxp+nEabgYO5mBMMNKRvbHx0eQttRYyIaNkTuMbAaqs4y3TkHOpGvZTJsvUonVMGAstSCfUmXnjF38aKpgyTausTSsxHbaxh3ieUB4ex+svnvsJ4Uh5Skklr+bxLVEHeJN55rxmV67ytLg5XCRWqdKIcJHFvSlm2YwJfcwIDAQABMacAL"

      dkim: {
        domainName: "example.com",
        keySelector: "2017",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBg...",
        cacheDir: "/tmp",
        cacheTreshold: 100 * 1024
      }
    };

    winston.debug("getTransport transport: ",transport);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(transport);
    return transporter;
  }

  // @deprecated
  // send(to, subject, html) {
  //   return this.sendMail({to:to, subject:subject, html:html});
  // }

  send(mail) {

    if (!this.enabled) {
      winston.info('EmailService is disabled. Not sending email');
      return 0;
    }
    if (process.env.NODE_ENV == 'test')  {	
      return winston.warn("EmailService not sending email for testing");
    }

    let mailOptions = {
      from: mail.from || this.from, // sender address
      to: mail.to,
      cc: mail.cc,
      // bcc: config.bcc,
      replyTo: mail.replyTo || this.replyTo,
      inReplyTo: mail.inReplyTo,
      references: mail.references,
      subject: mail.subject, // Subject line
      text: mail.text, // plain text body
      html: mail.html,

      headers: mail.headers || this.headers,
      
      messageId: mail.messageId,
      sender: mail.sender
    };

    winston.debug('mailOptions', mailOptions);
    if (!mail.to) {
      return winston.warn("EmailService send method. to field is not defined", mailOptions);
    }

    // send mail with defined transport object
    this.getTransport(mail.config).sendMail(mailOptions, (error, info) => {
      if (error) {    
        if (mail.callback){
          mail.callback(error, {info:info});
        }
        return winston.error("Error sending email ", {error:error,  mailOptions:mailOptions});
      }
      winston.verbose('Email sent:', {info: info});
      winston.debug('Email sent:', {info: info, mailOptions: mailOptions});

      if (mail.callback){
        mail.callback(error, {info:info});
      }
      
      // Preview only available when sending through an Ethereal account
      // winston.debug('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  }


  async sendTest(to, configEmail, callback) {      

    var that = this;

    var html = await this.readTemplate('test.html',{ "email" : {"templates": {test: "123"}}});

    var template = handlebars.compile(html);

    var replacements = {              
    };

    var html = template(replacements);
    
    return that.send({to:to, subject:`Rollout test email`, config: configEmail, html: html, callback: callback});
    
  }



  async sendNewAssignedRequestNotification(to, request, project) {      

    var that = this;

    //if the request came from rabbit mq?
    if (request.toJSON) {
      request = request.toJSON();
    }

    if (project.toJSON) {
      project = project.toJSON();
    }

    var html = await this.readTemplate('assignedRequest.html', project.settings);

    var envTemplate = process.env.EMAIL_ASSIGN_REQUEST_HTML_TEMPLATE;
      winston.debug("envTemplate: " + envTemplate);

    if (envTemplate) {
        html = envTemplate;
    }

    winston.debug("html: " + html);

    var template = handlebars.compile(html);

    var baseScope = JSON.parse(JSON.stringify(that));
    delete baseScope.pass;

    // passa anche tutti i messages in modo da stampare tutto
// Stampa anche contact.email


    let msgText = request.first_text;//.replace(/[\n\r]/g, '<br>');
    // winston.verbose("msgText: " + msgText);
    msgText = encode(msgText);
    // winston.verbose("msgText: " + msgText);
    if (this.markdown) {
      msgText = marked(msgText);
    }
    
    
    winston.debug("msgText: " + msgText);

    var replacements = {        
      request: request,
      project: project,
      msgText: msgText,
      baseScope: baseScope,
      // tools: {marked:marked}    
    };

    winston.debug("replacements ", replacements);

    var html = template(replacements);
    winston.debug("html after: " + html);

  
    let messageId = "notification" + "@" + MESSAGE_ID_DOMAIN;

    let replyTo;
    if (this.replyEnabled) { //fai anche per gli altri
      replyTo = request.request_id + this.inboundDomainDomainWithAt;
    }

    let headers;
    if (request) { 
      
        messageId = request.request_id + "+" + messageId;

        if (request.attributes && request.attributes.email_replyTo) {
          replyTo = request.attributes.email_replyTo;
        }        
    
      headers = {
                  "X-ROLLOUT-PROJECT-ID": project._id, 
                  "X-ROLLOUT-REQUEST-ID": request.request_id, 
                  "X-ROLLOUT-TICKET-ID":request.ticket_id,
                };

      winston.verbose("messageId: " + messageId);
      winston.verbose("replyTo: " + replyTo);
      winston.verbose("email headers", headers);
    }

    let inReplyTo;
    let references;
    if (request.attributes) {
      if (request.attributes.email_messageId) {
        inReplyTo = request.attributes.email_messageId;
        }
        if (request.attributes.email_references) {
        references = request.attributes.email_references;
        }
    }
    winston.verbose("email inReplyTo: "+ inReplyTo);
    winston.verbose("email references: "+ references);

    let from;
    let configEmail;
    if (project && project.settings && project.settings.email) {
      if (project.settings.email.config) {
        configEmail = project.settings.email.config;
        winston.verbose("custom email configEmail setting found: ", configEmail);
      }
      if (project.settings.email.from) {
        from = project.settings.email.from;
        winston.verbose("custom from email setting found: "+ from);
      }
    }



    let subject = `[Rollout ${project ? project.name : '-'}] New Assigned Chat`;

    if (request.subject) {
      subject = `[Rollout ${project ? project.name : '-'}] ${request.subject}`;
    }

    // if (request.ticket_id) {
    //   subject = `[Ticket #${request.ticket_id}] New Assigned Chat`;
    // }
    
    // if (request.ticket_id && request.subject) {
    //   subject = `[Ticket #${request.ticket_id}] ${request.subject}`;
    // }

    that.send({
      messageId: messageId,
      from:from, 
      to:to, 
      replyTo: replyTo,
      subject: subject, 
      html:html, 
      config: configEmail,
      headers:headers 
    });

    messageId =  "notification" + messageId;


    // togliere bcc 
    that.send({
      messageId: messageId,
      to: that.bcc, 
      replyTo: replyTo,
      subject: subject + ` ${to}  - notification`, 
      html:html,
      headers:headers 
    });

    
  }


  async sendNewAssignedAgentMessageEmailNotification(to, request, project, message) {      

    var that = this;

    //if the request came from rabbit mq?
    if (request.toJSON) {
      request = request.toJSON();
    }

    if (project.toJSON) {
      project = project.toJSON();
    }
    
    var html = await this.readTemplate('assignedEmailMessage.html', project.settings);


    var envTemplate = process.env.EMAIL_ASSIGN_MESSAGE_EMAIL_HTML_TEMPLATE;
      winston.debug("envTemplate: " + envTemplate);

    if (envTemplate) {
        html = envTemplate;
    }

    winston.debug("html: " + html);

    var template = handlebars.compile(html);

    var baseScope = JSON.parse(JSON.stringify(that));
    delete baseScope.pass;

    // passa anche tutti i messages in modo da stampare tutto
// Stampa anche contact.email

  let msgText = message.text;//.replace(/[\n\r]/g, '<br>');
  msgText = encode(msgText);
  if (this.markdown) {
    msgText = marked(msgText);
  }

  winston.debug("msgText: " + msgText);

    var replacements = {        
      request: request,
      project: project,
      message: message,
      msgText: msgText,
      baseScope: baseScope    
    };

    winston.debug("replacements ", replacements);

    var html = template(replacements);
    winston.debug("html after: " + html);


    let messageId = message._id + "@" + MESSAGE_ID_DOMAIN;

    let replyTo;
    if (this.replyEnabled) {
      replyTo = message.request.request_id + this.inboundDomainDomainWithAt;
    }

    let headers;
    if (message.request) { 
      
        messageId = message.request.request_id + "+" + messageId;

        if (message.request.attributes && message.request.attributes.email_replyTo) {
        replyTo = message.request.attributes.email_replyTo;
        }         
      
      headers = {"X-ROLLOUT-PROJECT-ID": project._id, "X-ROLLOUT-REQUEST-ID": message.request.request_id, "X-ROLLOUT-TICKET-ID":message.request.ticket_id };

      winston.verbose("sendNewAssignedAgentMessageEmailNotification messageId: " + messageId);
      winston.verbose("sendNewAssignedAgentMessageEmailNotification replyTo: " + replyTo);
      winston.verbose("sendNewAssignedAgentMessageEmailNotification email headers", headers);
    }

    let inReplyTo;
    let references;
    if (message.request.attributes) {
      if (message.request.attributes.email_messageId) {
        inReplyTo = message.request.attributes.email_messageId;
      }
      if (message.request.attributes.email_references) {
        references = message.request.attributes.email_references;
      }
    }
    winston.verbose("sendNewAssignedAgentMessageEmailNotification email inReplyTo: "+ inReplyTo);
    winston.verbose("sendNewAssignedAgentMessageEmailNotification email references: "+ references);

    let from;
    let configEmail;
    if (project && project.settings && project.settings.email) {
      if (project.settings.email.config) {
        configEmail = project.settings.email.config;
        winston.verbose("sendNewAssignedAgentMessageEmailNotification custom email configEmail setting found: ", configEmail);
      }
      if (project.settings.email.from) {
        from = project.settings.email.from;
        winston.verbose("sendNewAssignedAgentMessageEmailNotification custom from email setting found: "+ from);
      }
    }


    let subject = `[Rollout ${project ? project.name : '-'}] New message`;

    if (request.subject) {
      subject = `[Rollout ${project ? project.name : '-'}] ${request.subject}`;
    }
    if (request.ticket_id) {
      subject = `[Ticket #${request.ticket_id}] New message`;
    }
    
    if (request.ticket_id && request.subject) {
      subject = `[Ticket #${request.ticket_id}] ${request.subject}`;
    }



    that.send({
      messageId: messageId,
      from:from, 
      to:to, 
      replyTo: replyTo,
      // inReplyTo: inReplyTo,???
      // references: references,??
      subject: subject,
      html:html, 
      config: configEmail,        
      headers:headers 
    });


  
    messageId =  "notification" + messageId;

    that.send({
      messageId: messageId,
      to: that.bcc, 
      replyTo: replyTo,
      subject: subject + ` - notification`, 
      html:html,
      headers:headers 
    });

    
  }

  
  async sendNewPooledRequestNotification(to, request, project) {

    //if the request came from rabbit mq?
    if (request.toJSON) {
      request = request.toJSON();
    }

    if (project.toJSON) {
      project = project.toJSON();
    }

    var that = this;

    var html = await this.readTemplate('pooledRequest.html', project.settings);

    var envTemplate = process.env.EMAIL_POOLED_REQUEST_HTML_TEMPLATE;
      winston.debug("envTemplate: " + envTemplate);

    if (envTemplate) {
        html = envTemplate;
    }

    winston.debug("html: " + html);

    var template = handlebars.compile(html);

    var baseScope = JSON.parse(JSON.stringify(that));
    delete baseScope.pass;

// passa anche tutti i messages in modo da stampare tutto
// Stampa anche contact.email

    let msgText = request.first_text;//.replace(/[\n\r]/g, '<br>');
    msgText = encode(msgText);
    if (this.markdown) {
      msgText = marked(msgText);
    }

    winston.verbose("msgText: " + msgText);

    var replacements = {        
      request: request,
      project: project,
      msgText: msgText,
      baseScope: baseScope    
    };
  
    var html = template(replacements);

    
    let messageId = "notification-pooled" + new Date().getTime() + "@" + MESSAGE_ID_DOMAIN;

    let replyTo;
    if (this.replyEnabled) {
      replyTo = request.request_id + this.inboundDomainDomainWithAt;
    }

    let headers;
    if (request) { 
      
        messageId = request.request_id + "+" + messageId;

        if (request.attributes && request.attributes.email_replyTo) {
        replyTo = request.attributes.email_replyTo;
        }         

      headers = {"X-ROLLOUT-PROJECT-ID": project._id, "X-ROLLOUT-REQUEST-ID": request.request_id, "X-ROLLOUT-TICKET-ID":request.ticket_id };

      winston.verbose("sendNewPooledRequestNotification messageId: " + messageId);
      winston.verbose("sendNewPooledRequestNotification replyTo: " + replyTo);
      winston.verbose("sendNewPooledRequestNotification email headers", headers);
    }

    let inReplyTo;
    let references;
    if (request.attributes) {
      if (request.attributes.email_messageId) {
        inReplyTo = request.attributes.email_messageId;
        }
        if (request.attributes.email_references) {
        references = request.attributes.email_references;
        }
    }
    winston.verbose("sendNewPooledRequestNotification email inReplyTo: "+ inReplyTo);
    winston.verbose("sendNewPooledRequestNotification email references: "+ references);

    let from;
    let configEmail;
    if (project && project.settings && project.settings.email) {
      if (project.settings.email.config) {
        configEmail = project.settings.email.config;
        winston.verbose("sendNewPooledRequestNotification custom email configEmail setting found: ", configEmail);
      }
      if (project.settings.email.from) {
        from = project.settings.email.from;
        winston.verbose("sendNewPooledRequestNotification custom from email setting found: "+ from);
      }
    }

    let subject = `[Rollout ${project ? project.name : '-'}] New Pooled Chat`;

    if (request.subject) {
      subject = `[Rollout ${project ? project.name : '-'}] ${request.subject}`;
    }
    // if (request.ticket_id) {
    //   subject = `[Ticket #${request.ticket_id}] New Pooled Chat`;
    // }
    
    // if (request.ticket_id && request.subject) {
    //   subject = `[Ticket #${request.ticket_id}] ${request.subject}`;
    // }



    that.send({
      messageId: messageId,
      from:from, 
      to: to, 
      replyTo: replyTo,
      subject: subject, 
      html:html, 
      config:configEmail,
      headers:headers 
    });
  // this.send(that.bcc, `[Rollout ${project ? project.name : '-'}] New Pooled Request`, html);
  
  }





  async sendNewPooledMessageEmailNotification(to, request, project, message) {

    var that = this;

    
    //if the request came from rabbit mq?
    if (request.toJSON) {
      request = request.toJSON();
    }

    if (project.toJSON) {
      project = project.toJSON();
    }

    var html = await this.readTemplate('pooledEmailMessage.html', project.settings);


    var envTemplate = process.env.EMAIL_POOLED_MESSAGE_EMAIL_HTML_TEMPLATE;
    winston.debug("envTemplate: " + envTemplate);


    if (envTemplate) {
        html = envTemplate;
    }

    winston.debug("html: " + html);

    var template = handlebars.compile(html);

    var baseScope = JSON.parse(JSON.stringify(that));
    delete baseScope.pass;

    let msgText = message.text;//.replace(/[\n\r]/g, '<br>');
    msgText = encode(msgText);
    if (this.markdown) {
      msgText = marked(msgText);
    }

    winston.verbose("msgText: " + msgText);

    // passa anche tutti i messages in modo da stampare tutto
// Stampa anche contact.email

    var replacements = {        
      request: request,
      project: project,
      message: message,
      msgText: msgText,
      baseScope: baseScope    
    };

    winston.debug("replacements ", replacements);

    var html = template(replacements);
    winston.debug("html after: " + html);



    let messageId = message._id + "@" + MESSAGE_ID_DOMAIN;

    let replyTo;
    if (this.replyEnabled) {
      replyTo = message.request.request_id + this.inboundDomainDomainWithAt;
    }

    let headers;
    if (message.request) { 
      
        messageId = message.request.request_id + "+" + messageId;

        if (message.request.attributes && message.request.attributes.email_replyTo) {
          replyTo = message.request.attributes.email_replyTo;
        }         
      
      headers = {"X-ROLLOUT-PROJECT-ID": project._id, "X-ROLLOUT-REQUEST-ID": message.request.request_id, "X-ROLLOUT-TICKET-ID":message.request.ticket_id };

      winston.verbose("sendNewPooledMessageEmailNotification messageId: " + messageId);
      winston.verbose("sendNewPooledMessageEmailNotification replyTo: " + replyTo);
      winston.verbose("sendNewPooledMessageEmailNotification email headers", headers);
    }

    let inReplyTo;
    let references;
    if (message.request.attributes) {
      if (message.request.attributes.email_messageId) {
        inReplyTo = message.request.attributes.email_messageId;
      }
      if (message.request.attributes.email_references) {
        references = message.request.attributes.email_references;
      }
    }
    winston.verbose("sendNewPooledMessageEmailNotification email inReplyTo: "+ inReplyTo);
    winston.verbose("sendNewPooledMessageEmailNotification email references: "+ references);

    let from;
    let configEmail;
    if (project && project.settings && project.settings.email) {
      if (project.settings.email.config) {
        configEmail = project.settings.email.config;
        winston.verbose("sendNewPooledMessageEmailNotification custom email configEmail setting found: ", configEmail);
      }
      if (project.settings.email.from) {
        from = project.settings.email.from;
        winston.verbose("sendNewPooledMessageEmailNotification custom from email setting found: "+ from);
      }
    }


    let subject = `[Rollout ${project ? project.name : '-'}] New Message`;

    if (request.subject) {
      subject = `[Rollout ${project ? project.name : '-'}] ${request.subject}`;
    }
    if (request.ticket_id) {
      subject = `[Ticket #${request.ticket_id}] New Message`;
    }
    
    if (request.ticket_id && request.subject) {
      subject = `[Ticket #${request.ticket_id}] ${request.subject}`;
    }


    that.send({
      messageId: messageId,
      from:from, 
      to:to, 
      replyTo: replyTo,
      // inReplyTo: inReplyTo,???
      // references: references,??
      subject: subject,
      html:html, 
      config: configEmail,        
      headers:headers 
    });


  
    // messageId =  "notification" + messageId;

    // that.send({
    //   messageId: messageId,
    //   to: that.bcc, 
    //   replyTo: replyTo,
    //   subject: `[Rollout ${project ? project.name : '-'}] - ${request.subject ? request.subject : 'New message'} - notification`, 
    //   html:html,
    //   headers:headers 
    // });

    
  }


  async sendNewMessageNotification(to, message, project, tokenQueryString, sourcePage) {

    var that = this;

    //if the request came from rabbit mq?
   
    if (project.toJSON) {
      project = project.toJSON();
    }

    var html = await this.readTemplate('newMessage.html', project.settings);



    var envTemplate = process.env.EMAIL_NEW_MESSAGE_HTML_TEMPLATE;
      winston.debug("envTemplate: " + envTemplate);

    if (envTemplate) {
        html = envTemplate;
    }

    winston.debug("html: " + html);

    var template = handlebars.compile(html);

    var baseScope = JSON.parse(JSON.stringify(that));
    delete baseScope.pass;

    let msgText = message.text;//.replace(/[\n\r]/g, '<br>');
    msgText = encode(msgText);
    if (this.markdown) {
      msgText = marked(msgText);
    }

    winston.debug("msgText: " + msgText);

    var replacements = {        
      message: message,
      project: project,
      msgText:msgText, 
      seamlessPage: sourcePage,
      tokenQueryString: tokenQueryString,
      baseScope: baseScope    
    };

    var html = template(replacements);
    winston.debug("html: " + html);


    let messageId = message._id + "@" + MESSAGE_ID_DOMAIN;

    let replyTo;
    if (this.replyEnabled) {
      replyTo = message.request.request_id + this.inboundDomainDomainWithAt;
    }

    let headers;
    if (message.request) { 
      
        messageId = message.request.request_id + "+" + messageId;

        if (message.request.attributes && message.request.attributes.email_replyTo) {
        replyTo = message.request.attributes.email_replyTo;
        }         
      
      headers = {"X-ROLLOUT-PROJECT-ID": project._id, "X-ROLLOUT-REQUEST-ID": message.request.request_id, "X-ROLLOUT-TICKET-ID":message.request.ticket_id };

      winston.verbose("messageId: " + messageId);
      winston.verbose("replyTo: " + replyTo);
      winston.verbose("email headers", headers);
    }

    let inReplyTo;
    let references;
    if (message.request.attributes) {
      if (message.request.attributes.email_messageId) {
        inReplyTo = message.request.attributes.email_messageId;
      }
      if (message.attributes.email_references) {
        references = message.request.attributes.email_references;
      }
    }
    winston.verbose("email inReplyTo: "+ inReplyTo);
    winston.verbose("email references: "+ references);

    let from;
    let configEmail;
    if (project && project.settings && project.settings.email) {
      if (project.settings.email.config) {
        configEmail = project.settings.email.config;
        winston.verbose("custom email configEmail setting found: ", configEmail);
      }
      if (project.settings.email.from) {
        from = project.settings.email.from;
        winston.verbose("custom from email setting found: "+ from);
      }
    }


    that.send({
      messageId: messageId,
      // sender: message.senderFullname, //must be an email
      from:from, 
      to:to, 
      replyTo: replyTo, 
      inReplyTo: inReplyTo,
      references: references,
      subject:`[Rollout ${project ? project.name : '-'}] New Offline Message`, 
      html:html, 
      config:configEmail, 
      headers: headers
    });

    messageId =  "notification" + messageId;

    that.send({
      messageId: messageId,
      // sender: message.senderFullname, //must be an email
      to: that.bcc, 
      replyTo: replyTo,
      inReplyTo: inReplyTo, 
      references: references,
      subject: `[Rollout ${project ? project.name : '-'}] New Offline Message - notification`, 
      html:html, 
      headers: headers
    });

  }


  
  async sendEmailChannelNotification(to, message, project, tokenQueryString, sourcePage) {

    var that = this;


    if (project.toJSON) {
      project = project.toJSON();
    }

    var html = await this.readTemplate('ticket.html', project.settings);
    // this.readTemplateFile('ticket.txt', function(err, html) {


    var envTemplate = process.env.EMAIL_TICKET_HTML_TEMPLATE;
      winston.debug("envTemplate: " + envTemplate);

    if (envTemplate) {
        html = envTemplate;
    }

    winston.debug("html: " + html);

    var template = handlebars.compile(html);

    var baseScope = JSON.parse(JSON.stringify(that));
    delete baseScope.pass;


    let msgText = message.text;//.replace(/[\n\r]/g, '<br>');
    msgText = encode(msgText);
    if (this.markdown) {
      msgText = marked(msgText);
    }
    
    winston.debug("msgText: " + msgText);
    winston.debug("baseScope: " + JSON.stringify(baseScope));
    

    var replacements = {        
      message: message,
      project: project,
      seamlessPage: sourcePage,
      msgText: msgText,
      tokenQueryString: tokenQueryString,
      baseScope: baseScope    
    };

    var html = template(replacements);
    winston.debug("html: " + html);

    
  
    
    let messageId = message._id + "@" + MESSAGE_ID_DOMAIN;

    let replyTo;
    if (this.replyEnabled) {
      replyTo = message.request.request_id + this.inboundDomainDomainWithAt;
    }

    let headers;
    if (message.request) { 
      
        messageId = message.request.request_id + "+" + messageId;

        if (message.request.attributes && message.request.attributes.email_replyTo) {
          replyTo = message.request.attributes.email_replyTo;
        }
     
      headers = {"X-ROLLOUT-PROJECT-ID": project._id, "X-ROLLOUT-REQUEST-ID": message.request.request_id, "X-ROLLOUT-TICKET-ID":message.request.ticket_id };

      winston.verbose("messageId: " + messageId);
      winston.verbose("replyTo: " + replyTo);
      winston.verbose("email headers", headers);
    }
    

    let inReplyTo;
    let references;
    let cc;
    let ccString;

    if (message.request && message.request.attributes) {
      winston.debug("email message.request.attributes: ", message.request.attributes);

      if (message.request.attributes.email_messageId) {
        inReplyTo = message.request.attributes.email_messageId;
      }
      if (message.request.attributes.email_references) {
        references = message.request.attributes.email_references;
      }        

      if (message.request.attributes.email_cc) {
        cc = message.request.attributes.email_cc;       
      }
      winston.debug("email message.request.attributes.email_ccStr: "+ message.request.attributes.email_ccStr);
      if (message.request.attributes.email_ccStr!=undefined) {
        ccString = message.request.attributes.email_ccStr;
        winston.debug("email set ccString");
      }
    }
    winston.verbose("email inReplyTo: "+ inReplyTo);
    winston.verbose("email references: "+ references);
    winston.verbose("email cc: ", cc);
    winston.verbose("email ccString: "+ ccString);

    let from;
    let configEmail;
    if (project && project.settings && project.settings.email) {
      if (project.settings.email.config) {
        configEmail = project.settings.email.config;
        winston.verbose("custom email configEmail setting found: ", configEmail);
      }
      if (project.settings.email.from) {
        from = project.settings.email.from;
        winston.verbose("custom from email setting found: "+ from);
      }
    }


    // if (message.request && message.request.lead && message.request.lead.email) {
    //   winston.info("message.request.lead.email: " + message.request.lead.email);
    //   replyTo = replyTo + ", "+ message.request.lead.email;
    // }
    
    that.send({
      messageId: messageId,
      // sender: message.senderFullname, //must be an email
      from:from, 
      to:to, 
      cc: ccString,
      replyTo: replyTo, 
      inReplyTo: inReplyTo,
      references: references,
      // subject:`${message.request ? message.request.subject : '-'}`, 
      subject:`R: ${message.request ? message.request.subject : '-'}`,  //gmail uses subject
      text:html, 
      html:html,
      config:configEmail, 
      headers:headers 
    }); 
    
    messageId =  "notification" + messageId;

    that.send({
      messageId: messageId,
      // sender: message.senderFullname, //must be an email
      to: that.bcc, 
      replyTo: replyTo, 
      inReplyTo: inReplyTo,
      references: references,
      // subject: `${message.request ? message.request.subject : '-'} - notification`, 
      subject: `R: ${message.request ? message.request.subject : '-'} - notification`, 
      text:html, 
      html:html,
      headers:headers
    });

  }


/*
  sendEmailChannelTakingNotification(to, request, project, tokenQueryString) {
    var that = this;
    this.readTemplateFile('ticket-taking.txt', function(err, html) {
      // this.readTemplateFile('ticket.html', function(err, html) {
      var envTemplate = process.env.EMAIL_TICKET_HTML_TEMPLATE;
       winston.debug("envTemplate: " + envTemplate);
      if (envTemplate) {
          html = envTemplate;
      }
      winston.debug("html: " + html);
      var template = handlebars.compile(html);
      var baseScope = JSON.parse(JSON.stringify(that));
      delete baseScope.pass;
      var replacements = {        
        request: request,
        project: project.toJSON(),
        tokenQueryString: tokenQueryString,
        baseScope: baseScope    
      };
      var html = template(replacements);
      winston.debug("html: " + html);
      // if (message.request && message.request.lead && message.request.lead.email) {
      //   winston.info("message.request.lead.email: " + message.request.lead.email);
      //   replyTo = replyTo + ", "+ request.lead.email;
      // }
      
      that.send({to:to, replyTo: replyTo, subject:`R: ${request ? request.subject : '-'}`, text:html }); //html:html
      that.send({to: that.bcc, replyTo: replyTo, subject: `R: ${request ? request.subject : '-'} - notification`, text:html});//html:html
    });
  }
*/

  // ok
  async sendPasswordResetRequestEmail(to, resetPswRequestId, userFirstname, userLastname) {

    var that = this;

    var html = await this.readTemplate('resetPassword.html');


    var envTemplate = process.env.EMAIL_RESET_PASSWORD_HTML_TEMPLATE;
      winston.debug("envTemplate: " + envTemplate);

    if (envTemplate) {
        html = envTemplate;
    }

      winston.debug("html: " + html);

    var template = handlebars.compile(html);

    var baseScope = JSON.parse(JSON.stringify(that));
    delete baseScope.pass;


    var replacements = {        
      resetPswRequestId: resetPswRequestId,
      userFirstname: userFirstname,
      userLastname: userLastname,
      baseScope: baseScope    
    };

    var html = template(replacements);


    that.send({to: to, subject: '[Rollout] Password reset request', html:html});
    that.send({to:that.bcc, subject: '[Rollout] Password reset request - notification', html:html });

  }

  // ok
  async sendYourPswHasBeenChangedEmail(to, userFirstname, userLastname) {

    var that = this;

    var html = await this.readTemplateFile('passwordChanged.html');


    var envTemplate = process.env.EMAIL_PASSWORD_CHANGED_HTML_TEMPLATE;
      winston.debug("envTemplate: " + envTemplate);

    if (envTemplate) {
        html = envTemplate;
    }

      winston.debug("html: " + html);

    var template = handlebars.compile(html);

    var baseScope = JSON.parse(JSON.stringify(that));
    delete baseScope.pass;


    var replacements = {        
      userFirstname: userFirstname,
      userLastname: userLastname,
      to: to,
      baseScope: baseScope    
    };

    var html = template(replacements);


    that.send({to: to, subject:'[Rollout] Your password has been changed', html:html });
    that.send({to: that.bcc, subject: '[Rollout] Your password has been changed - notification', html: html });

  }


    // ok


  /**
   *! *** EMAIL: YOU HAVE BEEN INVITED AT THE PROJECT  ***
   */
   async sendYouHaveBeenInvited(to, currentUserFirstname, currentUserLastname, projectName, id_project, invitedUserFirstname, invitedUserLastname, invitedUserRole) {

    var that = this;

    var html = await this.readTemplateFile('beenInvitedExistingUser.html');

    var envTemplate = process.env.EMAIL_EXUSER_INVITED_HTML_TEMPLATE;
      winston.debug("envTemplate: " + envTemplate);

    if (envTemplate) {
        html = envTemplate;
    }

      winston.debug("html: " + html);

    var template = handlebars.compile(html);

    var baseScope = JSON.parse(JSON.stringify(that));
    delete baseScope.pass;


    var replacements = {        
      currentUserFirstname: currentUserFirstname,
      currentUserLastname: currentUserLastname,
      projectName: projectName,
      id_project: id_project,
      invitedUserFirstname: invitedUserFirstname,
      invitedUserLastname: invitedUserLastname,
      invitedUserRole: invitedUserRole,
      baseScope: baseScope    
    };

    var html = template(replacements);


    that.send({to:to, subject: `[Rollout] You have been invited to the '${projectName}' project`, html:html});
    that.send({to: that.bcc, subject: `[Rollout] You have been invited to the '${projectName}' project - notification`, html: html});
  }

    // ok


  /**
   *! *** EMAIL: YOU HAVE BEEN INVITED AT THE PROJECT (USER NOT REGISTERED) ***
   */
   async sendInvitationEmail_UserNotRegistered(to, currentUserFirstname, currentUserLastname, projectName, id_project, invitedUserRole, pendinginvitationid) {

   
    var that = this;

    var html = await this.readTemplateFile('beenInvitedNewUser.html');

    var envTemplate = process.env.EMAIL_NEWUSER_INVITED_HTML_TEMPLATE;
      winston.debug("envTemplate: " + envTemplate);

    if (envTemplate) {
        html = envTemplate;
    }

      winston.debug("html: " + html);

    var template = handlebars.compile(html);

    var baseScope = JSON.parse(JSON.stringify(that));
    delete baseScope.pass;


    var replacements = {        
      currentUserFirstname: currentUserFirstname,
      currentUserLastname: currentUserLastname,
      projectName: projectName,
      id_project: id_project,
      invitedUserRole: invitedUserRole,
      pendinginvitationid: pendinginvitationid,
      baseScope: baseScope    
    };

    var html = template(replacements);

    that.send({to:to, subject: `[Rollout] You have been invited to the '${projectName}' project`, html:html });
    that.send({to: that.bcc, subject: `[Rollout] You have been invited to the '${projectName}' project - notification`, html: html});

  }

  // ok
  async sendVerifyEmailAddress(to, savedUser) {

   
    var that = this;

    if (savedUser.toJSON) {
      savedUser = savedUser.toJSON();
    }
    var html = await this.readTemplateFile('verify.html');

    var envTemplate = process.env.EMAIL_VERIFY_HTML_TEMPLATE;
      winston.debug("envTemplate: " + envTemplate);

    if (envTemplate) {
        html = envTemplate;
    }

      winston.debug("html: " + html);

    var template = handlebars.compile(html);

    var baseScope = JSON.parse(JSON.stringify(that));
    delete baseScope.pass;


    var replacements = {        
      savedUser: savedUser,      
      baseScope: baseScope    
    };

    var html = template(replacements);


    that.send({to: to, subject: `[Rollout] Verify your email address`, html:html });
    that.send({to: that.bcc, subject: `[Rollout] Verify your email address `+to + " - notification", html:html });

  }







// ok

async sendRequestTranscript(to, messages, request, project) {


     //if the request came from rabbit mq?
     if (request.toJSON) {
      request = request.toJSON();
    }

    // if (project.toJSON) {
    //   project = project.toJSON();
    // }

    var transcriptAsHtml = ""; //https://handlebarsjs.com/guide/expressions.html#html-escaping
    messages.forEach(message => {
      transcriptAsHtml = transcriptAsHtml + '['+ message.createdAt.toLocaleTimeString('en', { timeZone: 'UTC' }) +'] ' + message.senderFullname + ': ' + message.text + '<br>';
    });
    winston.debug("transcriptAsHtml: " + transcriptAsHtml);
    
   
      
    var that = this;

    var html = await this.readTemplate('sendTranscript.html', project.settings);

    var envTemplate = process.env.EMAIL_SEND_TRANSCRIPT_HTML_TEMPLATE;
      winston.debug("envTemplate: " + envTemplate);

    if (envTemplate) {
        html = envTemplate;
    }

      winston.debug("html: " + html);

    var template = handlebars.compile(html);

    var baseScope = JSON.parse(JSON.stringify(that));
    delete baseScope.pass;


    var replacements = {        
      messages: messages,    
      request: request,  
      formattedCreatedAt: request.createdAt.toLocaleString('en', { timeZone: 'UTC' }),
      transcriptAsHtml: transcriptAsHtml,
      baseScope: baseScope    
    };

    var html = template(replacements);

    let configEmail;
    if (project && project.settings && project.settings.email && project.settings.email.config) {
      configEmail = project.settings.email.config;
      winston.verbose("custom email setting found: ", configEmail);
    }

    that.send({to:to, subject: '[Rollout] Transcript', html:html, config: configEmail});
    that.send({to: that.bcc, subject: '[Rollout] Transcript - notification', html:html });

}




}


var emailService = new EmailService();

// emailService.sendTest("al@f21.it");

module.exports = emailService;