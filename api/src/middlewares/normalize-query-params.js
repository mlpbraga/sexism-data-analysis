const _ = require('lodash');
const utf8 = require('utf8');
const { sanitizeQuery } = require('../utils/strings');

function sanitize(value) {
  if (Array.isArray(value)) {
    return value.map((x) => sanitize(x));
  }
  let sanitized = sanitizeQuery(value);
  try {
    sanitized = decodeURIComponent(sanitized);
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return sanitized;
}

/**
 * Normalize the query parameters keys and values to lowercase
 * @return {Void}
 */
function NormalizeQueryParams() {
  return function normalizeQueryParams(req, res, next) {
    req.query = _.transform(req.query, (result, val, key) => {
      /**
       * In some cases, we need to decode twice.
       * For more examples, take a look at unit
       * tests for sanitizeQuery method
       */
      let parsedValue = sanitize(val);

      try {
        parsedValue = utf8.decode(parsedValue);
        // eslint-disable-next-line no-empty
      } catch (e) {}

      result[key.toLowerCase()] = parsedValue;
    });

    next();
  };
}

module.exports = NormalizeQueryParams;
