const BaseError = require('./base');

class RequestError extends BaseError {
  constructor({ code, message, fields }) {
    let errorMsg = message;
    if (!message && fields && fields.length) {
      errorMsg = `Invalid arguments for parameter "${fields.join(', ')}"`;
    }

    // Overriding both message and status code
    super(errorMsg || 'Request validation failed', 400);

    // Saving custom property
    this.code = 1001;
    if (code !== undefined) {
      this.code = code;
    }

    this.fields = fields || [];
  }
}

module.exports = RequestError;
