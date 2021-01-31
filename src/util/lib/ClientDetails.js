var geoip = require("geoip-lite");
const ClientRequestData = async (request, response) => {
  try {
    //   var ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress;
    var requestlenght = request.baseUrl;
    if (!request.params[0] === "position.json") {
      request.status(301).json({ message: "Request Method Not Allowed" });
    } else {
      const forwarded = request.headers["x-forwarded-for"] || "103.209.71.41";
      var ip = forwarded
        ? forwarded.split(/, /)[0]
        : request.connection.remoteAddress;
      var geo = await geoip.lookup(ip);
      console.log(process.memoryUsage());
      const headers = {
        ipaddress: ip,
        language: request.headers["accept-language"],
        software: request.headers["user-agent"],
        cordinate: geo,
        // systemstatus: process.memoryUsage()
      };
      await response.status(200).json(JSON.stringify(headers));
    }
  } catch (error) {
    console.error(`Error occurred while saving subscription. Err: ${error}`);
    await response
      .status(500)
      .json({ error: `Technical error occurred ${error}` });
  }
};

const ClientInfo = async (request, response) => {
  try {
    const ip =
      request.headers["x-forwarded-for"] || request.connection.remoteAddress;

    const headers = {
      ipaddress: ip,
      language: request.headers["accept-language"],
      software: request.headers["user-agent"]
    };

    await response.status(200).json({data:`${headers}`});
  } catch (error) {
    console.error(`Error occurred while saving subscription. Err: ${error}`);
    request.status(500).json({ error: "Technical error occurred" });
  }
};

module.exports = {
  ClientRequestData,
  ClientInfo
};
