const logger = require('../utils/logger');
const VotesDAO = require('../dao/vote-dao');
const VotesRequestFormatter = require('../formatters/request/votes');
// const constant = require('../../../utils/constants');

// const _ = require('lodash');

module.exports = {
  async handlePost(req, res, next) {
    let response;
    try {
      const reqParams = VotesRequestFormatter.format(req);
      response = await VotesDAO.add(reqParams);
      return res.status(200).json(response);
    } catch (error) {
      logger.error(`Votes Controller::handleGet ${error}`);
      logger.debug(error);
      return next(error);
    }
  },
};
