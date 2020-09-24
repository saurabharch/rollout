const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json(`message: Valid`);
  //   res.render("index/partners");
});

module.exports = router;
