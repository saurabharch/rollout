const  sharp = require('sharp');
const Imager = require('../lib/imager');
var config = require('../../config/imager-config');
export default{
    key: 'GenerateThumnails',
    async handle({ data }){
      const { InputData } = data;
    // await sharp(InputData.InputBuffere);
    
    config.variants.item.thumb.rename = function (file) {
      return 'user/1/thumb/' + InputData.filename;
    };
    config.variants.item.large.rename = function (file) {
      return 'user/1/large/' + InputData.filename;
    };
    var imager = new Imager(config.variants.item, config.storages.amazon);
     await imager.upload(InputData.InputBuffere, function (err, avatar) {
        avatar =>
        {
          thumb = [ 'https://'+ config.storages.amazon.container +'.s3.amazonaws.com//user/1/thumb/'+ InputData.filename, ];
          large = [ 'https://'+ config.storages.amazon.container +'.s3.amazonaws.com/user/1/large/'+InputData.filename, ];
        }
      }).then(p => console.log(`${p.avatar}`));
    }
};
