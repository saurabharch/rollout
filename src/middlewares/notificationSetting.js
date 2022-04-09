import Pushsetting from '../model/pushSetting';
import Push from '../model/push';

const GetMessageSender = async (req, res, next) => {
  try{
    const message = await Pushsetting.findOne({ users: req.body.site_id });
    if(message){ return res.status(200).json({ message: 'not valid message setting' }); }
    const email = await User.findOne({ email: req.body.email });
    if(email){ return res.status(200).json({ message: 'message sender email is valid' }); }
    
  }catch(error){
    res.status(500).json({ message: error });
  }
  next();
};

const checkMessageExisted = async (req, res, next) => {
  const { pushId } = req.params;
  if(pushId){
      const Exists = await Push.findById(pushId);
      if(!Exists){
        var data = req.params;
        return res.status(400).json({
          message: Exists+ ' Message Id does not exists'
        });
      }
  }

  next();
};


export{ GetMessageSender, checkMessageExisted };
