const webpush = require("web-push");
const vapidKeys = webpush.generateVAPIDKeys();

const vapidKeygen = async (request, reponse) => {
  try {
    if (!request.body.keygen) {
      request((error, response, body) => {
        if (error) console.error(error);
        if (response.statusCode !== 200) {
          return request.status(400).json({ msg: "Invalid Request" });
        }
        request.json(JSON.parse(body));
      });
    } else {
      try {
        const publickey = await vapidKeys.publicKey;
        const privatekey = await vapidKeys.privateKey;
        return await reponse
          .status(200)
          .json({ publicKey: publickey, privateKey: privatekey });
      } catch (error) {
        return await reponse
          .status(200)
          .json(
            `Server is running keys are - Public key => null '\n' Private key => null || Error msg: ${error}`
          );
        reponse.end();
      }
    }
  } catch (error) {
    return await reponse
      .status(301)
      .json(`Request is not defined|| Error msg: ${error}`);
    reponse.end();
  }
};

module.exports = vapidKeygen;
