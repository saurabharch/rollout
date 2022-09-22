export default{
  key: 'PushReport',
  options: {
    delay: 10,
    priority:2
  },
  async handle({ data }){
    const { notificationData } = data;
    
    console.log(notificationData);
  }
};
