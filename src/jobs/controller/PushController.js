const QueueService = require('../../lib/Queue');
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
    await QueueService.add('PushNotification', {notificationData});

    await QueueService.add('PushReport', {notificationData});
    var test = [];
    test.push(notificationData);
    test.push({"message": "notification successfull added in queue channel"})
    return test;
  }
};