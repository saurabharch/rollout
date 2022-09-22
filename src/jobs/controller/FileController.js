import Queue from "../../lib/Queue";
var CircularJSON = require('circular-json');
export default{
  async Thumbnail(req, res){
    const { filename, type, dimension, InputBuffere } = req.body;

    const InputData = {
      filename,
      type,
      dimension,
      InputBuffere
    };

    // Adding job GenerateThumnails and save against the user account
    await Queue.add('GenerateThumnails',CircularJSON.stringify(InputData) );
    await Queue.add('ThumnailReport',CircularJSON.stringify(InputData) );
    await Queue.add('GenerateThumnails',CircularJSON.stringify(InputData));
    await Queue.add('ThumnailReport',CircularJSON.stringify(InputData)); 
    await Queue.add('GenerateThumnails',CircularJSON.stringify(InputData));
    await Queue.add('ThumnailReport',CircularJSON.stringify(InputData) ); 
    await Queue.add('GenerateWebBrowserIcons',CircularJSON.stringify(InputData));
    await Queue.add('GeneratedWebBrowserIconReports',CircularJSON.stringify(InputData));
    return res.json(CircularJSON.stringify(InputData));
  }
};
