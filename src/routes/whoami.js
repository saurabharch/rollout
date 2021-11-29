const express = require('express');
const router = express.Router();
const geoip = require('geoip-lite');
const { ClientRequestData, ClientInfo,ClientI } = require('../util/lib/ClientDetails');
router.get('/', (req, res, next) => {
  try{
    const { request, response } = { request: req, response: res };
    ClientI(request, response);
  }catch(error){
    return next(error);
  }
});

router.get('/pushgeek-geo.js', (req, res, next) => {
  try{
    const { request, response } = { request: req, response: res };
    ClientRequestData(request, response);
  }catch(error){
    return next(error);
  }
});

router.get('/pushgeek-geo.json', (req, res, next) => {
  try{
    const { request, response } = { request: req, response: res };
    ClientI(request, response);
  }catch(error){
    return next(error);
  }
});
module.exports = router;
