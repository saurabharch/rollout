const express = require("express");
const router = express.Router();
const Subscription = require("../model/subscriber");

router.post("/", (req, res) => {
  const subscriptionModel = new Subscription(req.body);
  console.log(req.body);
  subscriptionModel.save((err, subscription) => {
    if (err) {
      console.error(`Error occurred while saving subscription. Err: ${err}`);
      res.status(500).json({
        error: "Technical error occurred"
      });
    } else {
      res.json({
        data: "Subscription saved."
      });
    }
  });
});

router.get("/", (req, res) => {
  res.json({
    data: "Invalid Request Bad"
  });
});
module.exports = router;
