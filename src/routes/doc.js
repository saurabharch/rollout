const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index/documents');
});

module.exports = router;
