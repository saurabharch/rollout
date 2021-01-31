import sharp from'sharp';
export default{
    key: 'GenerateThumnails',
    async handle({ data }){
      const { InputData } = data;
    await sharp(InputData.InputBuffere);
    }
};
