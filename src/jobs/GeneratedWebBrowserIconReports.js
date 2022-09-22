const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');

export default{
    key: 'GeneratedWebBrowserIconReports',
    options: {
      delay: 5000,
      priority:10
    },
    async handle({ data }){
      const { InputData } = data;

      console.log(InputData);
    }
  };
