import Queue from'../../lib/Queue';

export default{
  async store(data){
    const Data = data;
  //  console.log(`1. Mail Registered Userdata: ${JSON.stringify(Data)}`)
   // const user = Data;
    const user = {
      firstName:Data.firstName,
      lastName:Data.lastName,
      email:Data.email,
      username: Data.username,
      link:Data.link
    };
  
    // ADD job For RegistrationMail
    await Queue.add('RegistrationMail', {user});
     // FIXME:
    await Queue.add('UserReport', {user});
    var test = [];
    test.push(user);
    test.push({"message": "successfull added in queue channel"})
    return test;
  }
};
