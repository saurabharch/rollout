import User from'../model/user';
import Role from "../model/role";
import Domain from'../model/domains';
import Subscriber from '../model/subscriber';
const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try{
    const user = await User.findOne({ username: req.body.username }).lean();
    console.log(`username is info: ${JSON.stringify(user)}`)
    if(user){ return res.status(409).json({ message: 'The user already exists' }); }
    const email = await User.findOne({ email: req.body.email }).exec();
    console.log(`Email Already Exists: ${JSON.stringify(email)}`)
    if(email){ return res.status(409).json({ message: 'The email already exists' }); }
    next();
  }catch(error){
    res.status(500).json({ message: error.message });
  }
};



const checkRolesExisted = async(req, res, next) => {
  if(req.body.roles){
    const role = await Role.find({name:[req.body.roles]});
    var data_ = role.map(nRole => nRole.name);
    if(!data_.includes(req.body.roles)){
        return res.status(400).json({
          message: `Role ${req.body.roles} does not exist`
        });
      }
    
  }

  next();
};

const CheckDomainExistOrNot = async(req,res,next) => {
try {
  
  const IsAvailableDomain = await Domain.findOne({ siteUrl:req.body.siteUrl }).exec();
  console.log(`${IsAvailableDomain}`)
  if(IsAvailableDomain){ return res.status(409).json({ message: 'Domain is associated with some other organization \n\rPlease chose new Domain Name' }); }
  next()
} catch (error) {
   res.status(500).json({ message: error.message });
} 
};

export{ checkDuplicateUsernameOrEmail, checkRolesExisted,CheckDomainExistOrNot };
