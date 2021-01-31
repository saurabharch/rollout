import Queue from'../../lib/Queue';

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
    await Queue.add('GenerateThumnails', { InputData });

    await Queue.add('ThumnailReport', { InputData });
    return res.json(InputData);
  }
};
