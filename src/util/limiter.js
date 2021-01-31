const ratelimit = require('express-rate-limit');
// var rate            = require("./lib/rate");
// const redis     = require('redis');
// const client      = redis.createClient();
// create the rate redis handler
// var redisHandler = new rate.Redis.RedisRateHandler({client: client});



// 
// Monitor rate of a route
//

// options: handler is the mechanism where rate information is kept
// interval is the interval on which we are listening for the rate. Here we're counting requests per 1 second.
// If we switch interval to 10, then we are counting how many requests this route is handling per 10 seconds.
// var simpleMiddleware = rate.middleware({handler: redisHandler, interval: 1});
//
// Monitor the rate of this route, and report the RPS of **only you** hitting this route
//
// var monitorMiddleware2 = rate.middleware({handler: redisHandler, interval: 1});
// 
// Key requesters by their API key instead of IP
//

// var apiKeyMiddleware = rate.middleware(
//   {handler: redisHandler, 
//    limit: 10,
//    interval: 2, 
//    getRemoteKey: function (req) {
//     return req.params.api_key;
//    }
// });

//
// Monitor and rate-limit this route
//

// this middleware will only allow 2 requests for every 4 seconds from a specific user
// var limiterMiddleware = rate.middleware({handler: redisHandler, interval: 4, limit: 2});
// 
// Customize the headers sent back during rate limiting and the message returned
//

// var headersMiddleware = rate.middleware(
//   {handler: redisHandler, 
//    limit: 5,
//    interval: 5, 
//    setHeadersHandler: function (req, res, rate, limit, resetTime) {

//             var remaining = limit - rate;

//             if (remaining < 0) {
//                 remaining = 0;
//             }

//             // follows Twitter's rate limiting scheme and header notation
//             // https://dev.twitter.com/docs/rate-limiting/faq#info
//             res.setHeader('X-RateLimit-Limit', limit);
//             res.setHeader('X-RateLimit-Remaining', remaining);
//             res.setHeader('X-RateLimit-Reset', resetTime);
//         },

//         onLimitReached: function (req, res, rate, limit, resetTime, next) {
            
//             // HTTP code 420 from http://mehack.com/inventing-a-http-response-code-aka-seriously
//             res.json({error: 'Rate limit exceeded. Check headers for limit information.'}, {status: 420});
//         }
// });
const  Ratelimited = (function(casename,rate, Limit, resetTime) {
    switch(casename){
        case `${casename}`: 
             var limiter = new ratelimit({
                windowMs: `${resetTime}` * 60 * 1000, // 15 minutes 
                max: rate, // limit each IP to 100 requests per windowMs 
                delayMs: 0 // disable delaying - full speed until the max limit is reached 
            });
            Limit = limiter;
            return Limit;
        break;
         default:
             var limiter = new ratelimit({
                windowMs: 15 * 60 * 1000, // 15 minutes 
                max: rate, // limit each IP to 100 requests per windowMs
                delayMs: 0
                // disable delaying - full speed until the max limit is reached 
                // message:"Too many accounts created from this IP, please try again after an 15 Min."
            });
            Limit = limiter;
            return Limit;
        break;
    }
});
module.exports = Ratelimited