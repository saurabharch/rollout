
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const settings = new mongoose.Schema({
    gcm:[{
         id: {type:String, default:null},
        phonegap: {type:Boolean,dafault:false},
        // phonegap compatibility mode, see below (defaults to false)
    }],
    apn: [{
        token:[{
            key: {type:String,default:'./certs/key.p8'}, // optionally: fs.readFileSync('./certs/key.p8')
            keyId: {type:String,default:'ABCD'},
            teamId:{type:String, default:'EFGH'},
        }],
      cert: {type:String, default:'cert.pem'},
      key: {type:String,default:'key.pem'},
      ca: {type:String, default:null},
      pfx: {type:String,default:null},
      passphrase: {type:String,default:null},
      voip: {type:Boolean,default:false},
      address: {type:String, default:null},
      port: {type:Number, default:443},
      rejectUnauthorized: {type:String, default:true},
      connectionRetryLimit: {type:Number,default:10},
      cacheLength: {type:Number,default:1000},
      connectionTimeout: {type:Number,default:3600000},
      autoAdjustCache: {type:Boolean, default:true},
      maxConnections: {type:Number,default:1},
      minConnections: {type:Number,default:1},
      connectTimeout: {type:Number,default:10000},
      buffersNotifications: {type:Number, default:true},
      fastMode: {type:Boolean, default:false},
      disableNagle: {type:Boolean, default:false},
      disableEPIPEFix: {type:Boolean, default:false},
      production: {type:Boolean, default:false} // true for APN production environment, false for APN sandbox environment,
    }],
    adm:[{
        client_id: {type:String, default:null},
        client_secret: {type:String,default:null},
    }],
    wns:[{
        client_id: {type:String, default:null},
        client_secret: {type:String,default:null},
        notificationMethod: {type:String, default:'sendTileSquareBlock'},
    }],
    web: [{
        vapidDetails: [{
            subject: {type:String, default:'mailto:saurabh@raindigi.com'},
            publicKey: {type:String, default:'BLgFTwjElUH_Iz72TKDvmlsc-EcwziNP2X28BmN-znOXJhv35QybtfcN1HTh_eUlNffp12HkuruYpqtKNedN54s'},
            privateKey: {type:String, default:'Lckqnvu2RrAKlG3uutce3o-kiI7HSc1LXsy5AdlryXQ'},
        }],
        gcmAPIKey: {type:String, default: ''},
        TTL: {type:Number, default:'2419200'},
        contentEncoding: {type:String, default:'aes128gcm'},
        headers: {type:String, default:''}
    }],
    users:[{
        userId:{type:String , default:''}
    }],
    isAlwaysUseFCM: {type:Boolean, default:false}, // true all messages will be sent through node-gcm (which actually uses FCM)
    _parent: Schema.ObjectId
},
 {
        timestamps: true,
        versionKey: false
}
);
const Pushsetting = mongoose.model('push_settings', settings);
module.exports = Pushsetting;