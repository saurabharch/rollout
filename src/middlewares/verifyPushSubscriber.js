import Subscriber from '../model/subscriber';

const checkSubscriberDuplicate = async (req,res,next) => {
  try{
    const subscriber = await Subscriber.findOne({endpoint:req.body.subscription.endpoint }).exec();
    if(subscriber){ return res.status(409).json({ message: 'The push notification already subscribed' }); }
    next();
  }catch(error){
    console.log(error.message);
    return res.status(500).json({ message: error });
  }
}

const checkSubscriberExist = async (req,res,next) => {
  try{
    const subscriber = await Subscriber.findOne({endpoint:req.body.subscription.endpoint }).exec();
    if(subscriber){ return res.status(200).json({ message: 'The push notification already subscribed' }); }
    next();
  }catch(error){
    console.log(error.message);
    return res.status(500).json({ message: error });
  }
}

export{checkSubscriberDuplicate,checkSubscriberExist};