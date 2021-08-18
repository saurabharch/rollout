const ObjectId = require('mongodb').ObjectID;
const _ = require('lodash');

const restrictedRoutes = [
    { route: '/index/admin/product/new', response: 'redirect' },
    { route: '/index/admin/product/insert', response: 'redirect' },
    { route: '/index/admin/product/edit/:id', response: 'redirect' },
    { route: '/index/admin/product/update', response: 'redirect' },
    { route: '/index/admin/product/delete/:id', response: 'redirect' },
    { route: '/index/admin/product/publishedState', response: 'json' },
    { route: '/index/admin/product/setasmainimage', response: 'json' },
    { route: '/index/admin/product/deleteimage', response: 'json' },
    { route: '/index/admin/product/removeoption', response: 'json' },
    { route: '/index/admin/order/statusupdate', response: 'json' },
    { route: '/index/admin/settings/update', response: 'json' },
    { route: '/index/admin/settings/pages/new', response: 'redirect' },
    { route: '/index/admin/settings/pages/edit/:page', response: 'redirect' },
    { route: '/index/admin/settings/pages', response: 'json' },
    { route: '/index/admin/settings/page/delete/:page', response: 'json' },
    { route: '/index/admin/settings/menu/new', response: 'json' },
    { route: '/index/admin/settings/menu/update', response: 'json' },
    { route: '/index/admin/settings/menu/delete', response: 'json' },
    { route: '/index/admin/settings/menu/saveOrder', response: 'json' },
    { route: '/index/admin/file/upload', response: 'json' }
];

const restrict = (req, res, next) => {
    checkLogin(req, res, next);
};

const checkLogin = async (req, res, next) => {
    const db = req.app.db;
    // if not protecting we check for public pages and don't checkLogin
    if(req.session.needsSetup === true){
        res.redirect('index/admin/setup');
        return;
    }

    // If API key, check for a user
    if(req.headers.apikey){
        try{
            const user = await db.users.findOne({
                apiKey: ObjectId(req.headers.apikey),
                isAdmin: true
            });
            if(!user){
                res.status(400).json({ message: 'Access denied' });
                return;
            }
            // Set API authenticated in the req
            req.apiAuthenticated = true;
            next();
            return;
        }catch(ex){
            res.status(400).json({ message: 'Access denied' });
            return;
        }
    }

    if(req.session.user){
        next();
        return;
    }
    res.redirect('index/admin/login');
};

// Middleware to check for admin access for certain route
const checkAccess = (req, res, next) => {
    const routeCheck = _.find(restrictedRoutes, { route: req.route.path });

    // If the user is not an admin and route is restricted, show message and redirect to /admin
    if(req.session.isAdmin === false && routeCheck){
        if(routeCheck.response === 'redirect'){
            req.session.message = 'Unauthorised. Please refer to administrator.';
            req.session.messageType = 'danger';
            res.redirect('index/admin');
            return;
        }
        if(routeCheck.response === 'json'){
            res.status(400).json({ message: 'Unauthorised. Please refer to administrator.' });
        }
    }else{
        next();
    }
};

const checkPassword = (req, res, next) => {   
    // regex to validate password
    const regex = /[A-Za-z0-9]/;
    const pwd = req.body.userPassword;
    const defaultLength = 7;

    if(regex.test(pwd) && regex.test(pwd) && pwd.length > defaultLength){
        next();
    }
    else{
        res.status(400).json({ message: 'Invalid Password : Please uses Digit,Characters' });
    }

};
module.exports = {
    restrict,
    checkLogin,
    checkAccess,
    checkPassword
};
