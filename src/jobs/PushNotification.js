const q = require('q');
import PushNotifications from 'rollout-pushnotification';
import Pushsetting from "../model/pushSetting";
import Push from'../model/push';
import User from'../model/user';
const keys = require('../../config/keys');
const Subscription = require('../model/subscriber');
const fs = require('fs');
const isOnline = require('is-online');
// const { clearKey } = require("../util/cache");


const toObject = (map = new Map) => {
                    if (!(map instanceof Map)) return map
                    return Object.fromEntries(Array.from(map.entries(), ([k, v]) => {
                        if (v instanceof Array) {
                        return [k, v.map(toObject)]
                        } else if (v instanceof Map) {
                        return [k, toObject(v)]
                        } else {
                        return [k, v]
                        }
                    }))
                }
var object = [];
const settings = {
    gcm: {
        id: null,
        phonegap: false, // phonegap compatibility mode, see below (defaults to false)
    },
    // apn: {
    //     token: {
    //         key: '', //'./certs/key.p8', // optionally: fs.readFileSync('./certs/key.p8')
    //         keyId: 'ABCD',
    //         teamId: 'EFGH',
    //     },
        
    //     production: false // true for APN production environment, false for APN sandbox environment,
    // },
    adm: {
        client_id: null,
        client_secret: null,
    },
    wns: {
        client_id: null,
        client_secret: null,
        notificationMethod: 'sendTileSquareBlock',
    },
    web: {
        vapidDetails: {
            subject: 'mailto:saurabh@raindigi.com',
            publicKey: keys.publicKey,
            privateKey: keys.privateKey,
        },
        gcmAPIKey: 'gcmkey',
        TTL: 2419200,
        contentEncoding: 'aes128gcm',
        headers: {}
    },
    isAlwaysUseFCM: false, // true all messages will be sent through node-gcm (which actually uses FCM)
};
const push = new PushNotifications(settings);
export default{
  key: 'PushNotification',
  async handle({ data }){
    const { notificationData } = data;
    // console.log(`notification data: ${JSON.stringify(data)}`)
    // const settings = Pushsetting.findById('')
    isOnline().then(async online => {
    if(online){
        try {
            console.log("We have internet");
           console.log(` Registered Ids : ${notificationData.registrationIds} \n\rNotification Payload : ${notificationData.payload}`);
            // Latest Dynamic Method for multi-platform sending notification
            // You can use it in node callback style
                // await push.send(notificationData.registrationIds, notificationData.payload);
                await push.send(notificationData.registrationIds, notificationData.payload, (err, result) => {
                         if (err) {
                             console.log(JSON.stringify(err));
                         } else {
                            
                             const valuesArray = JSON.stringify(...result);
                             const obj = toObject(valuesArray);
                            // object.push(obj);
                               console.log(obj);
                         }
                });

                
                    // object.map((x,index) => {
                    //     const y = JSON.parse(x);
                        
                    //     //console.log(y.message[3].regId);
                    //     //console.log(y);
                    //         for (var make in y) {
                    //                         for (var model in y[make]) {
                    //                             const doors = y.message[model].regId.endpoint;
                    //                             const p256dhKey = y.message[model].regId.keys.p256dh;
                    //                             const authKey = y.message[model].regId.keys.auth;
                    //                             if(y.message[model].error != null){
                    //                                 //console.log(doors);
                    //                                 // console.log(` data from error response : ${JSON.stringify(y.message[model].regId)}`);
                    //                                 // var Query = {
                    //                                 //     endpoint: doors,
                    //                                 //     keys: {
                    //                                 //     p256dh: p256dhKey,
                    //                                 //     auth: authKey
                    //                                 //     }
                    //                                 // }
                    //                                // const Query = JSON.stringify(y.message[model].regId)
                    //                                 RemoveErrorEndpoints();
                    //                                 //console.log(Query);
                    //                                 // Subscriber.deleteMany({_id:{$in:[ObjectID('611b10574cae973d44120dad')]}});
                    //                                 // const dic = Subscription.find({endpoint:doors}).exe();
                    //                                 // console.log(`Error Reponse Data : ${dic}`)
                    //                             //     Subscription.find({subscription:{ $elemMatch: { $elemMatch: { endpoint: { $in: `${doors}` } } } } },function(err,data){
                    //                             //     if(err)
                    //                             //     {
                    //                             //         console.log(err);
                    //                             //     }   
                    //                             //     else{
                    //                             //         console.log(`endpoint id : ${data._id}`)
                    //                             //         console.log("deleted");
                    //                             //     }
                    //                             // }).exec();

                                                
                    //                             // TODO: aggregate unreachable destination or error  endpoints subscription id and remove from database
                    //                            // const cursor = Subscription.aggregate().match([{subscription:{ endpoint: { $in: doors } }}]).pipeline({remove:true });
                    //                         //    const cursor = Subscription.find().where({'endpoint':doors}).exec((err,records) => {
                    //                         //        console.log(`${JSON.stringify(records)}`)
                    //                         //    })
                    //                             // const cursor = Subscriber.findOne({"subscription.endpoint":doors}).select({'_id.$oid':1}).exec(function(error, subscriber) {
                    //                             //         if (error) {
                    //                             //             // callback({error: true})
                    //                             //             console.log(error)
                    //                             //         } else if (!subscriber) {
                    //                             //             // callback({error: true})

                    //                             //         } else{
                    //                             //             console.log(`subscriber : ${subscriber}`)
                    //                             //         }
                    //                             //      }
                    //                             //     );
                    //                                 // for(const doc of cursor) {
                    //                                     //console.log(JSON.stringify(doors).replace(/"/g,''));
                    //                                   async function RemoveErrorEndpoints() {
                    //                                     //    await Subscription.find({endpoint:`${JSON.stringify(doors).replace(/"/g,'')}`}, async function (err, result) {
                    //                                     //     if (err){
                    //                                     //         console.log(`Error in removing endpoint: ${err.message}`)
                    //                                     //     }else{
                    //                                     //         await result.remove();
                    //                                     //         console.log("Remove Result :", result) 
                    //                                     //     }
                    //                                     // }).explain("executionStats");
                    //                                     const cursor = await Subscription.aggregate([{$match:{ endpoint: { $in: JSON.stringify(doors).replace(/"/g,'') } }}]);
                    //                                     for(const doc of cursor) {
                    //                                         console.log(doc)
                    //                                        await Subscription.findAndModify({endpoint:doc},{$unset:{"endpoint": "" }, $remove:true});
                    //                                     }

                    //                                   }
                    //                                 // }

                    //                         }
                                                
                    //                         //}
                    //             }
                    //         }
                    // });
                 await push.moveToCompleted('done', true)
            }catch(error) {
                        if (error.response) {
                            await push.moveToFailed({message: 'job failed'})
                        }
            }
        } else {
            console.log("we have a problem");
        }
    });

  }
}