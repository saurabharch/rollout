
var message = require('./responseMessages')

module.exports = {
    EMAIL_ALREADY_EXITS : {
        httpCode: 409,
        statusCode: 409,
        message: message.EMAIL_ALREADY_EXITS
    },
    SIGNUP_SUCCESS : {
        httpCode: 200,
        statusCode: 200,
        message: message.SIGN_UP_SUCCESS
    },
    USER_DOESNOT_EXISTS : {
        httpCode: 404,
        statusCode: 404,
        message: message.USER_DOESNOT_EXISTS
    },
    INVALID_CREDENTIALS:{
        httpCode: 404,
        statusCode: 404,
        message: message.INVALID_CREDENTIALS
    },
    LOGIN_SUCCESS :{
        httpCode: 200,
        statusCode: 200,
        message: message.SUCCESS
    },
    UNAUTHORISED:{
        httpCode: 401,
        statusCode: 401,
        message: message.UNAUTHORISED
    },
    // WALLET_ALREADY_EXISTS :{
    //     httpCode: 409,
    //     statusCode: 409,
    //     message: message.WALLET_EXISTS
    // },
    // WALLET_DOESNOT_EXISTS :{
    //     httpCode: 404,
    //     statusCode: 404,
    //     message: message.WALLET_DOES_NOT_EXISTS
    // },
    // LOAN_ALREADY_PROVIDED :{
    //     httpCode: 409,
    //     statusCode: 409,
    //     message: message.LOAN_ALREADY_PROVIDED
    // },
    // LOAN_NOT_PAID_OFF :{
    //     httpCode: 409,
    //     statusCode: 409,
    //     message: message.LOAN_NOT_PAID_OFF
    // },
    // LOAN_NOT_EXISTS :{
    //     httpCode: 405,
    //     statusCode: 405,
    //     message: message.LOAN_DOES_NOT_EXISTS
    // },
    // NO_PENDING_AMOUNT:{
    //     httpCode: 404,
    //     statusCode: 404,
    //     message: message.NO_PENDING_AMOUNT
    // },
    LOGOUT_SUCCESS:{
        httpCode: 200,
        statusCode: 200,
        message: message.LOG_OUT
    },
    INVALID_OLD_PASSWORD:{
        httpCode: 200,
        statusCode: 200,
        message: message.INCORRECT_OLD_PASSWORD
    },
    PASSWORD_CHANGE_SUCCESSFULLY:{
        httpCode: 200,
        statusCode: 200,
        message: message.PASSWORD_UPDATED_SUCCESSFULLY
    },
    TOKEN_EXPIRED:{
        httpCode: 401,
        statusCode: 401,
        message: message.LINK_EXPIRED
    }
}