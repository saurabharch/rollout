class HttpError extends Error{}

export class BadRequest extends HttpError{
  constructor(message = 'Bad Request'){
    super(message);

    this.status = 400;
  }
}

export class Unauthorized extends HttpError{
  constructor(message = 'Unauthorized'){
    super(message);

    this.status = 401;
  }
}

module.exports.ConflictError = require('./conflict-error');
module.exports.ForbiddenError = require('./forbidden-error');
module.exports.NotFoundError = require('./not-found-error');
module.exports.PaymentError = require('./payment-error');
module.exports.SearchError = require('./search-error');
module.exports.UnAuthorizedError = require('./unauthorized-error');
module.exports.ValidationError = require('./validation-error');
