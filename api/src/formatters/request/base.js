/* eslint-disable camelcase */
const _ = require('lodash');

const BaseRequestFormatter = {
  format(reqParams) {
    const formattedParams = {};
    if (!_.isEmpty(reqParams)) {
      const {
        q,
        id,
        deleted,
      } = reqParams.query;

      // const {
      //   userna
      // }
      if (q) {
        formattedParams.q = q;
      }
      if (id) {
        formattedParams.id = id;
      }
      if (deleted) {
        formattedParams.deleted = deleted;
      }
    }
    return formattedParams;
  },
};

module.exports = BaseRequestFormatter;
