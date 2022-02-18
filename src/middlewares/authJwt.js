import jwt from'jsonwebtoken';
import config from'../config/auth';
import User from'../model/user';
import Role from'../model/role';

export const verifyToken = async (req, res, next) => {
  
  const authHeader = req.headers.authorization;
  const BearerToken = authHeader.split(" ")[1];
  const token = req.headers['x-access-token'] || BearerToken;
 if(token) {
    if(!token)return res.status(403).json({ message: 'No token provided' });
  try{
    const decoded = jwt.verify(token, config.SESS_OPTIONS.SESS_SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });
    if(!user)return res.status(404).json({ message: 'No user found' });

    next();
  }catch(error){
    return res.status(401).json({ message: 'Unauthorized!' });
  }
 }
};

export const isModerator = async (req, res, next) => {
  try{
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for(let i = 0; i < roles.length; i++){
      if(roles[i].name === 'moderator'){
        next();
        return;
      }
    }

    return res.status(403).json({ message: 'Require Moderator Role!' });
  }catch(error){
    console.log(error);
    return res.status(500).send({ message: error });
  }
};

export const isAdmin = async (req, res, next) => {
  try{
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for(let i = 0; i < roles.length; i++){
      if(roles[i].name === 'admin'){
        next();
        return;
      }
    }

    return res.status(403).json({ message: 'Require Admin Role!' });
  }catch(error){
    console.log(error);
    return res.status(500).send({ message: error });
  }
};
