require('dotenv').config({path:__dirname+'./.env'})
exports.storages = {
  local: {
    provider: 'local',
    path: '/uploads',
    mode: '0777'
  },
  rackspace: {
    provider: 'rackspace',
    username: process.env.IMAGER_RACKSPACE_USERNAME,
    apiKey: process.env.IMAGER_RACKSPACE_KEY,
    authUrl: 'https://lon.auth.api.rackspacecloud.com',
    region: 'IAD', // https://github.com/pkgcloud/pkgcloud/issues/276
    container: process.env.IMAGER_RACKSPACE_CONTAINER
  },
  amazon: {
    provider: 'amazon',
    key: process.env.IMAGER_S3_KEY,
    keyId: process.env.IMAGER_S3_KEYID,
    container: process.env.IMAGER_S3_BUCKET
  },
  MINIO:{
    provider:'minio',
    endPoint: process.env.MINIO_ENDPOINT,
    port: process.env.MINIO_PORT,
    useSSL: process.env.MINIO_SSL_STATUS,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    region: process.env.MINIO_REGION, 
    transport: process.env.MINIO_TRANSPORT, 
    sessionToken:'', 
    partSize:  process.env.MINIO_PART_SIZE || '100mb'
  }
};