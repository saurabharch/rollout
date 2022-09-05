const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  var cli = ['brew','npm','yarn','pnpm']
  res.render('index/documents',{
    cli: cli.map(tools => tools)
  });
});

module.exports = router;
