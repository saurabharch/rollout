import sharp from'sharp';
import Imager from '../lib/imager';
var config = require('../../config/imager-config');
var storage = require('../../config/storage');
var minioClient = require('./minio-lib');
export default{
    key: 'GenerateWebBrowserIcons',
    async handle({ data }){
      const { InputData } = data;
    // await sharp(InputData.InputBuffere);
    
    config.variants.item.WebIcon.rename = function (file) {
      return 'user/1/webicon/webicon519X519-' + InputData.filename;
    };
    config.variants.item.WebIcon96X96.rename = function (file) {
      return 'user/1/webicon/webicon96X96-' + InputData.filename;
    };
    config.variants.item.WebIcon144X144.rename = function (file) {
      return 'user/1/webicon/webicon144X144-' + InputData.filename;
    };
    config.variants.item.WebIcon310X310.rename = function (file) {
      return 'user/1/webicon/webicon310X310-' + InputData.filename;
    };
    config.variants.item.WebFevicon16X16.rename = function (file) {
      return 'user/1/webicon/webfevicon16X16-' + InputData.filename;
    };
    config.variants.item.WebFevicon32X32.rename = function (file) {
      return 'user/1/webicon/webfevicon32X32-' + InputData.filename;
    };
    config.variants.item.WebFevicon96X96.rename = function (file) {
      return 'user/1/webicon/webfevicon96X96-' + InputData.filename;
    };
    config.variants.item.WebFevicon.rename = function (file) {
      return 'user/1/webicon/webfevicon-' + InputData.filename;
    };
    var imager = new Imager(config.variants.item, storage.amazon);
    await imager.upload(InputData.InputBuffere, function (err, avatar) {
        avatar =>
        {

            WebIcon=[ 'https://'+ storage.amazon.container +'.s3.amazonaws.com/user/1/webicon/webicon519X519'+ InputData.filename, ];
            WebIcon96X96=[ 'https://'+ storage.amazon.container +'.s3.amazonaws.com/user/1/webicon/webicon96X96-'+ InputData.filename, ];
            WebIcon144X144=[ 'https://'+ storage.amazon.container +'.s3.amazonaws.com/user/1/webicon/webicon144X144-'+ InputData.filename, ];
            WebIcon310X310=[ 'https://'+ storage.amazon.container +'.s3.amazonaws.com/user/1/webicon/webicon310X310-'+ InputData.filename, ];
            WebFevicon16X16=[ 'https://'+ storage.amazon.container +'.s3.amazonaws.com/user/1/webicon/webfevicon16X16-'+ InputData.filename, ];
            WebFevicon32X32=[ 'https://'+ storage.amazon.container +'.s3.amazonaws.com/user/1/webicon/webfevicon32X32-'+ InputData.filename, ];
            WebFevicon96X96=[ 'https://'+storage.amazon.container +'.s3.amazonaws.com/user/1/webicon/webfevicon96X96-'+ InputData.filename, ];
            WebFevicon=[ 'https://'+ storage.amazon.container +'.s3.amazonaws.com/user/1/webicon/webfevicon-'+ InputData.filename, ];
        }
      }).then(p => console.log(`${p.avatar}`));
    }
};
