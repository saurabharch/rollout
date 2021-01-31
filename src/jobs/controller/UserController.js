import Queue from'../../lib/Queue';

export default{
  async store(data, res){
    const Data = data;
  // const {firstName,lastName,email,link} = Data
    console.log(`1. Mail Registered Userdata: ${Data}`)
   // const user = Data;
    const user = {
      firstName:Data[0].firstName,
      lastName:Data[0].lastName,
      email:Data[0].email,
      link:Data[1].link
    };
    // ADD job For RegistrationMail
    await Queue.add('RegistrationMail', {user});

    await Queue.add('UserReport', {user});
    return res.json(user);
  }
};
