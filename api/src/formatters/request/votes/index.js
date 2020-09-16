const bcrypt = require('bcryptjs');
const _ = require('lodash');
const BaseRequestFormatter = require('../base');

const VotesRequestFormatter = {
  format(reqParams) {
    const formattedParams = BaseRequestFormatter.format(reqParams);
    formattedParams.commentId = reqParams.body.commentid;
    if (reqParams.body.vote === 's') {
      formattedParams.vote = 1;
    } else if (reqParams.body.vote === 'n') {
      formattedParams.vote = 0;
    } else if (reqParams.body.vote === 'ns') {
      formattedParams.vote = -1;
    }
    formattedParams.userId = reqParams.user.email;
    return formattedParams;
  },
};

module.exports = VotesRequestFormatter;
