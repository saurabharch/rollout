const QueueService = require('../../lib/Queue');

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
    await QueueService.add('GenerateThumnails', { InputData });
    await QueueService.add('ThumnailReport', { InputData });
    await QueueService.add('GenerateThumnails', { InputData });
    await QueueService.add('ThumnailReport', { InputData }); 
    await QueueService.add('GenerateThumnails', { InputData });
    await QueueService.add('ThumnailReport', { InputData }); 
    await QueueService.add('GenerateWebBrowserIcons', { InputData });
    await QueueService.add('GeneratedWebBrowserIconReports', { InputData });
    return res.json(InputData);
  }
};
