module.exports = {
  aws: {
    bucketName: "bseb-file-container",
    accessKey: "AKIAJ6TA7PR5VQ3R262A",
    secretKey: "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"
  },
  // mongoURI:
  //   "mongodb+srv://kappy:Kappy123*@cluster0-nikh7.mongodb.net/test?retryWrites=true&w=majority", //
  mongoURI: "mongodb://kappy:Kappy123*@ds215633.mlab.com:15633/web-push",
  privateKey: process.env.VAPID_PRIVATE_KEY,
  publicKey: process.env.VAPID_PUBLIC_KEY,
  GCM_Key: process.env.GCM_KEY,
  // Google Plus Credential
  googleClientID:
    "477995149649-i60ar391u3hcagi6913mvmkcr15053m6.apps.googleusercontent.com", //process.env.GOOGLE_CLIENT_ID ||
  googleClientSecret: "roLhwsJ9w6wynRBhPi4TC2rK", //process.env.GOOGLE_CLIENT_SECRET ||

  //Facebook App Credential
  clientID: "332933764733792",
  clientSecret: "70a61dc9674a2cd6f2766bc2854b3e95",

  // Twitter App Credential
  ConsumerKey: "gh4rUzjBBiJDyV0GX7QIUyQgA",
  ConsumerSecret: "ZWOFftsmwfvk84vVqs1ULLpXolxnKnCDhGGxKEkPa2FHqOrvsH",

  //Pinterest App Credential
  AppID: "4976540289092039020",
  AppSecret: "d153b1a9fa994120e1af50507ea506ba7fe2845a9b655ae45daf587053bd3516",

  // Instagram Crendential
  InstaId: "58c897b525e44caabc52ceefbda8dbce",
  InstaSecret: "77c94fab96cb484bbda4289c41d92bc7"
};
