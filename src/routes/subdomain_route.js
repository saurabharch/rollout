const express = require('express');
const router = express.Router();
const User = require('../model/user.js');

router.use(async (req, res, next) => {
    var users = await User.find({});

    users.forEach((user) => {
        if (user.link.indexOf(req.headers.host) > -1) {
            res.profile = {
                ...user._doc,
                link: 'https://' + user.link,
                fullname: user.fullname,
            };
        }
    });

    next();
});

router.get('/', (req, res, next) => {
    if (res.profile) {
        return res.render('subdomain', {
            subdomain: req.vhost.hostname,
            profile: res.profile,
            title: 'Accessing: ' + req.vhost.hostname,
        });
    } else {
        return res.render('subdomain', {
            subdomain: req.vhost.hostname,
            profile: null,
            title: 'Invalid: ' + req.vhost.hostname,
            create_subdomain_link: 'https://' + process.env.DOMAIN,
        });
    }
});

module.exports = router;