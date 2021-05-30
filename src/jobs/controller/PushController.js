import Queue from'../../lib/Queue';
export default{
  async notification(data){
    const Data = data;
  // const {firstName,lastName,email,link} = Data
  //  console.log(`1. Push Notification Data : ${JSON.stringify(Data)}`)
   // const user = Data;
    const notificationData = {
    registrationIds:Data.registrationIds,
    payload:Data.payload
  }
    // ADD job For RegistrationMail
    await Queue.add('PushNotification', {notificationData});

    await Queue.add('PushReport', {notificationData});
    var test = [];
    test.push(notificationData);
    test.push({"message": "notification successfull added in queue channel"})
    return test;
  }
};