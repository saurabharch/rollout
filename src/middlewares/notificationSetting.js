import Pushsetting from'../model/pushSetting';
import Push'../model/push';

const GetMessageSender = async (req, res, next) => {
  try{
    const user = await Pushsetting.findOne({ users: req.body.username });
    if(message){ return res.status(200).json({ message: 'message sender username is valid' }); }
    const email = await User.findOne({ email: req.body.email });
    if(email){ return res.status(200).json({ message: 'message sender email is valid' }); }
    next();
  }catch(error){
    res.status(500).json({ message: error });
  }
};

const checkMessageExisted = (req, res, next) => {
  const { pushId } = req.params;
  if(pushId){
      var Exists = push.findById(pushId)
      if(!Exists){
        var data = req.params;
        return res.status(400).json({
          message: `Push message is does not exists`
        });
      }
  }

  next();
};


export{ checkDuplicateUsernameOrEmail, checkRolesExisted };
