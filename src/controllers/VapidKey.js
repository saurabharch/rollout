import {vapidKeygen} from "../util/lib/VapidKeyGen";
import Pushsetting from "../model/pushSetting";


export const SaveVapidKeyAgainstDomain = async(req,res, next) => {
    const {site_id, project_id} = req.params;
        const {webSubject} = req.body;
        const vapidkey = await vapidKeygen;
        const findDomain = await Pushsetting.findOneAndUpdate({'siteId':{$in:siteId},}, (err, pushData) => {
            if(err){
                return res.status(500).json({
                    message: err.message
                })
            }
            else { 
                pushData.web.vapidDetails.subject = webSubject;
                pushData.web.vapidDetails.publicKey = vapidkey.publicKey;
                pushData.web.vapidDetails.privateKey = vapidkey.privateKey;
                pushData.save();
                return res.status(201).json(pushData);
            }
        })
    next();
}

export const EnableVapidKey = async(req,res) =>{
    const{_id} = req.body._id;
    const {action} = req.param;
    const VapidAction = await Pushsetting.findOneAndUpdate({'site_id':{$in:site_id},}, (err, pushData) => {
            if(err){
                return res.status(500).json({
                    message: err.message
                })
            }
            else {
                console.log(`push Setting Data for vapid action ===> ${pushData}`);
               try {
                 pushData.web.vapidDetails.status=action;
                 pushData.update();
               } catch (error) {
                   console.log(`push setting vapid key action error message ===> ${error.message}`)
               }
            
            }
    }
    )};