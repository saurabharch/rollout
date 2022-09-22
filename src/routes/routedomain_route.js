const express = require('express');
const router = express.Router();
const User = require('../model/usernew.js');

router.get('/', async (req, res, next) => {
    var allUsers = await User.find({});

    return res.render('rootdomain', {
        title: 'Accessing: ' + req.vhost.hostname,
        allUsers: allUsers.map((user) => {
            return {
                ...user._doc,
                link: 'https://' + user.link,
                fullname: user.fullname,
            };
        }),
    });
});

router.post('/', async (req, res) => {
    try {
        let data = {
            email: req.body.email,
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        };

        var user = new User(data);
        await user.save();
        return res.redirect('/');
    } catch (error) {
        return res.json({ ...error });
    }
});
module.exports = router;