
var message = require('./responseMessages');

export class HttpStatusCode {

    constructor(p_apiCode, p_httpCode){
        this.apiCode = p_apiCode;
        this.httpCode = p_httpCode;

        HttpStatus[p_apiCode] = this;
    }


    static create(p_apiCode){
        if(HttpStatus[p_apiCode]){
            return HttpStatus[p_apiCode];
        }

        return HttpStatusCode.UNKNOWN;
    }
}

// https://stackoverflow.com/questions/30716886/es6-read-only-enums-that-can-map-value-to-name

// Reference For Enum Object https://github.com/SpeechifyInc/speechify-commons
var  HttpStatus = {
  Continue : 100,
  SwitchingProtocols : 101,
  Processing : 102,
  OK : 200,
  Created : 201,
  Accepted : 202,
  NonAuthoritativeInformation : 203,
  NoContent : 204,
  ResetContent : 205,
  PartialContent : 206,
  MultiStatus : 207,
  AlreadyReported : 208,
  IMUsed : 226,
  MultipleChoices : 300,
  MovedPermanently : 301,
  Found : 302,
  SeeOther : 303,
  NotModified : 304,
  UseProxy : 305,
  TemporaryRedirect : 307,
  PermanentRedirect : 308,
  BadRequest : 400,
  Unauthorized : 401,
  PaymentRequired : 402,
  Forbidden : 403,
  NotFound : 404,
  MethodNotAllowed : 405,
  NotAcceptable : 406,
  ProxyAuthenticationRequired : 407,
  RequestTimeout : 408,
  Conflict : 409,
  Gone : 410,
  LengthRequired : 411,
  PreconditionFailed : 412,
  PayloadTooLarge : 413,
  RequestURITooLong : 414,
  UnsupportedMediaType : 415,
  RequestedRangeNotSatisfiable : 416,
  ExpectationFailed : 417,
  IAmTeapot : 418,
  MisdirectedRequest : 421,
  UnprocessableEntity : 422,
  Locked : 423,
  FailedDependency : 424,
  UpgradeRequired : 426,
  PreconditionRequired : 428,
  TooManyRequests : 429,
  RequestHeaderFieldsTooLarge : 431,
  ConnectionClosedWithoutResponse : 444,
  UnavailableForLegalReasons : 451,
  ClientClosedRequest : 499,
  InternalServerError : 500,
  NotImplemented : 501,
  BadGateway : 502,
  ServiceUnavailable : 503,
  GatewayTimeout : 504,
  HTTPVersionNotSupported : 505,
  VariantAlsoNegotiates : 506,
  InsufficientStorage : 507,
  LoopDetected : 508,
  NotExtended : 510,
  NetworkAuthenticationRequired : 511,
  NetworkConnectTimeoutError : 599,
};




Object.freeze(HttpStatusCode);

module.exports = {
    EMAIL_ALREADY_EXITS : {
        httpCode: HttpStatusCode.Conflict,
        statusCode: HttpStatusCode.Conflict,
        message: message.EMAIL_ALREADY_EXITS
    },
    SIGNUP_SUCCESS : {
        httpCode: HttpStatusCode.OK,
        statusCode: HttpStatusCode.OK,
        message: message.SIGN_UP_SUCCESS
    },
    USER_DOESNOT_EXISTS : {
        httpCode: HttpStatusCode.NotFound,
        statusCode: HttpStatusCode.NotFound,
        message: message.USER_DOESNOT_EXISTS
    },
    INVALID_CREDENTIALS:{
        httpCode: HttpStatusCode.NotFound,
        statusCode: HttpStatusCode.NotFound,
        message: message.INVALID_CREDENTIALS
    },
    LOGIN_SUCCESS :{
        httpCode: HttpStatusCode.OK,
        statusCode: HttpStatusCode.OK,
        message: message.SUCCESS
    },
    UNAUTHORISED:{
        httpCode: HttpStatusCode.Unauthorized,
        statusCode: HttpStatusCode.Unauthorized,
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
        httpCode: HttpStatusCode.OK,
        statusCode: HttpStatusCode.OK,
        message: message.LOG_OUT
    },
    INVALID_OLD_PASSWORD:{
        httpCode: HttpStatusCode.NonAuthoritativeInformation,
        statusCode: HttpStatusCode.NonAuthoritativeInformation,
        message: message.INCORRECT_OLD_PASSWORD
    },
    PASSWORD_CHANGE_SUCCESSFULLY:{
        httpCode: HttpStatusCode.Accepted,
        statusCode: HttpStatusCode.Accepted,
        message: message.PASSWORD_UPDATED_SUCCESSFULLY
    },
    TOKEN_EXPIRED:{
        httpCode: HttpStatusCode.Unauthorized,
        statusCode: HttpStatusCode.Unauthorized,
        message: message.LINK_EXPIRED
    }
}


