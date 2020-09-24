const express = require("express");
const router = express.Router();

router.get("/timestamp/:date_string?", (req, res) => {
  if (req.params.date_string) {
    var date_string = req.params.date_string;

    // check the date_string can be parsed to integer
    if (!isNaN(date_string)) {
      var date = new Date(parseInt(date_string));
    } else {
      var date = new Date(date_string);
    }
  } else {
    var date = new Date();
  }

  // check the date_string is invalid date
  if (isNaN(date.getTime())) {
    res.json({
      error: "Invalid Date"
    });
  } else {
    var unix = date.getTime();
    var utc = date.toUTCString();

    res.json({
      unix: unix,
      utc: utc
    });
  }
});

module.exports = router;
