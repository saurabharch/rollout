import Queue from "../../lib/Queue";
var CircularJSON = require('circular-json');
export default{
  async notification(data){
    const Data = data;
  // const {firstName,lastName,email,link} = Data
   //console.log(`\n1. Push Notification Registration ID's Data : ${JSON.stringify(Data.registrationIds)} \n2. Push Notification Data : ${JSON.stringify(Data.payload)}`);
   // const user = Data;
    const notificationData = {
    registrationIds:Data.registrationIds,
    payload:Data.payload
  }
    // ADD job For RegistrationMail
    await Queue.add('PushNotification', CircularJSON.stringify(notificationData));

    await Queue.add('PushReport', CircularJSON.stringify(notificationData));
    var test = [];
    // test.push(CircularJSON.stringify(notificationData));
    test.push({"message": "notification successfull added in queue channel"})
    return test;
  }
};