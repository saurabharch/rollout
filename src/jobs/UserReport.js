export default{
  key: 'UserReport',
  options: {
    delay: 5000,
    priority:10
  },
  async handle({ data }){
    const { user } = data;
    
    console.log(user);
  }
};
