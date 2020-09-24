const express = require("express");
const router = express.Router();

router.get("/terms-of-service-agreement", (req, res) => {
  res.render("index/terms-of-service-agreement");
});

module.exports = router;
