const multer = require('multer');

export default{
    key: 'ThumnailReport',
    options: {
      delay: 5000,
      priority:10
    },
    async handle({ data }){
      const { InputData } = data;

      console.log(InputData);
    }
  };
