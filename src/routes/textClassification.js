const express = require('express');
const router = express.Router();
const textClassificationResult = require('../util/lib/textTagClassification');
// const mongoose = require("mongoose");
// const Subscription = mongoose.model("subscribers");

router.post('/textResult', async (req, res, error) => {
  try{
    const { request, response } = { request: req, response: res };
    textClassificationResult(request, response);
  }catch(error){
    return next(error);
  }
});

router.get('/', (req, res) => {
  res.json({
    data: 'Invalid Request Bad'
  });
});
module.exports = router;
