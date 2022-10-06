const express = require('express');
const router = express.Router();
const colors = require('colors');
const stripHtml = require('string-strip-html');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;
const {
    getId,
    hooker,
    clearSessionValue,
    getImages,
    addSitemapProducts,
    getCountryList
} = require('../lib/common');
const {
    getSort,
    paginateProducts
} = require('../lib/paginate');
const {
    getPaymentConfig
} = require('../lib/config');
const {
    updateTotalCart,
    emptyCart,
    updateSubscriptionCheck
} = require('../lib/cart');
const {
    createReview,
    getRatingHtml
} = require('../lib/modules/reviews-basic');
const {
    sortMenu,
    getMenu
} = require('../lib/menu');
const {
    setupVerifone
} = require('../lib/payment-common.js');
const countryList = getCountryList();


 

// The main entry point of the shop

router.get('/', (req, res) => {
  res.render('index/plans');
});

module.exports = router;
