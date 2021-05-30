export default{
  key: 'PushReport',
  options: {
    delay: 10
  },
  async handle({ data }){
    const { notificationData } = data;
    
    console.log(notificationData);
  }
};
