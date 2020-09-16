const BaseError = require('./base');

class ResponseError extends BaseError {
  constructor({ message, code }) {
    // Overriding both message and status code
    super(message || 'Something went wrong', 500);

    // Saving custom property
    this.code = 1000;
    if (code !== undefined) {
      this.code = code;
    }
  }
}

module.exports = ResponseError;
