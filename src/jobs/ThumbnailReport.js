const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');

export default{
    key: 'ThumnailReport',
    options: {
      delay: 5000
    },
    async handle({ data }){
      const { InputData } = data;

      console.log(InputData);
    }
  };
