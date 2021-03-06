const brain = require("brain.js");
const data = require("./data.json");

const TextTagAnalysis = async (request, response) => {
  try {
    const TextTitle = request.body.title;
    //const RequestData = req.body;
    const payload = {
      title: request.body.title,
      message: request.body.message,
      url: request.body.url,
      tag: req.body.tag
    };
    if (!request.body.title) {
      console.error(`Error occurred while saving subscription. Err: ${err}`);
      response.status(500).json({ error: "Technical error occurred" });
    } else {
      const network = new brain.recurrent.LSTM();
      const trainingData = await data.map(item => ({
        input: item.text,
        output: item.category
      }));

      await network.train(trainingData, {
        // Defaults values --> expected validation
        iterations: 150, // the maximum times to iterate the training data --> number greater than 0
        errorThresh: 0.41 // the acceptable error percentage from training data --> number between 0 and 1
        // log: false, // true to use console.log, when a function is supplied it is used --> Either true or a function
        // logPeriod: 10, // iterations between logging out --> number greater than 0
        // learningRate: 0.3, // scales with delta to effect training rate --> number between 0 and 1
        // momentum: 0.1, // scales with next layer's change value --> number between 0 and 1
        // callback: null, // a periodic call back that can be triggered while training --> null or function
        // callbackPeriod: 10, // the number of iterations through the training data between callback calls --> number greater than 0
        //timeout: Infinity, // the max number of milliseconds to train for --> number greater than 0
      });
      if (payload) {
        var ttitle = "";
        var mmessage = "";
        var uurl = "";
        var ttag = "";
        if (payload.title) {
          ttitle = await network.run(payload.title);
        } else {
          title = "ok";
        }
        if (payload.message) {
          mmessage = await network.run(payload.message);
        } else {
          mmessage = "ok";
        }
        if (payload.url) {
          uurl = await network.run(payload.url);
        } else {
          url = "ok";
        }
        if (payload.tag) {
          ttag = await network.run(payload.tag);
        } else {
          ttag = "ok";
        }
        //Result = JSON.stringify(obj)
        // const ddata = await network.run(data);
        //console.log(`Category: ${payload}`);
        response.json({
          TitleCategory: ttitle,
          MessageCategory: mmessage,
          UrlCategory: uurl,
          TagCategory: ttag
        });
      }
    }
  } catch (error) {
    response.status(302).json("Bad Request Result");
  }
};

module.exporst = TextTagAnalysis;
