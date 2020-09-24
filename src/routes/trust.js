const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index/trust");
});

module.exports = router;
