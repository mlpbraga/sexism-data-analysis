const _ = require('lodash');

/**
 * Normalize the body parameters keys and values to lowercase
 * @return {Void}
 */
function NormalizeBodyParams() {
  return function normalizeBodyParams(req, res, next) {
    req.body = _.transform(req.body, (result, val, key) => {
      const parsedValue = val;
      result[key.toLowerCase()] = parsedValue;
    });

    next();
  };
}

module.exports = NormalizeBodyParams;
