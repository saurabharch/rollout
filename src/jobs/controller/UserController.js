// const Queue = require('../../lib/Queue');
import Queue from "../../lib/Queue";
var CircularJSON = require('circular-json');
export default{
  async store(data){
    const Data = data;
  //  console.log(`1. Mail Registered Userdata: ${JSON.stringify(Data)}`);
   // const user = Data;
    const user = {
      firstName:Data[0].firstName,
      lastName:Data[0].lastName,
      email:Data[0].email,
      username: Data[0].username,
      link:Data[0].link
    };
  // console.log(`Transform Mail Data : ${JSON.stringify(user)}`);
    // ADD job For RegistrationMail
     await Queue.add('RegistrationMail', CircularJSON.stringify(user));

    await Queue.add('UserReport', CircularJSON.stringify(user));
    var test = [];
    // test.push(CircularJSON.stringify(user));
    test.push({"message": "notification successfull added in queue channel"})
    return test;
  }
};
