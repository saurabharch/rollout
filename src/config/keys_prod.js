module.exports = {
    aws: {
    bucketName: ''||process.env.AWS_Bucket_Name,
    accessKey: ''||process.env.AWS_Access_Key,
    secretKey: ''||||process.env.AWS_Secret_Key
  },
  mongoURI: ''||process.env.Mongo_DB_URI,
  privateKey: ''||process.env.VAPID_Private_Key,
  publicKey: ''||process.env.VAPID_Public_Key,
  GCM_Key: ''||process.env.GCM_KEY,
  // Google Plus Credential
  googleClientID: ''||process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: ''|| process.env.GOOGLE_CLIENT_SECRET,

  // Facebook App Credential
  clientID: ''||process.env.FACEBOOK_CLIENT_ID,
  clientSecret: ''||process.env.FACEBOOK_CLIENT_SECRET,

  // Twitter App Credential
  ConsumerKey: ''||process.env.TWITTER_CONSUMER_KEY,
  ConsumerSecret: ''||process.env.TWITTER_CONSUMER_SECRET,

  // Pinterest App Credential
  AppID: ''||process.env.PINTEREST_APP_ID,
  AppSecret: ''||process.env.PINTEREST_APP_SECRET,

  // Instagram Crendential
  InstaId: ''||process.env.INSTA_CLIENT_ID,
  InstaSecret: ''||process.env.INSTA_SECRET_KEY
};
