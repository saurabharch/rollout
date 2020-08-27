module.exports = {
  // mongoURI:
  //   "mongodb+srv://kappy:Kappy123*@cluster0-nikh7.mongodb.net/test?retryWrites=true&w=majority", //
  mongoURI: "mongodb://kappy:Kappy123*@ds215633.mlab.com:15633/web-push",
  privateKey: process.env.VAPID_PRIVATE_KEY,
  publicKey: process.env.VAPID_PUBLIC_KEY,
  GCM_Key: process.env.GCM_KEY
};
