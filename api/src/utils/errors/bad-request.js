const RequestError = require('./request');

const throwBadRequest = ({
  code, message, fields,
}) => {
  throw new RequestError({
    code,
    message,
    fields,
  });
};

module.exports = { throwBadRequest };
