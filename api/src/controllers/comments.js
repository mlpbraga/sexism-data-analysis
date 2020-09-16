const logger = require('../utils/logger');
const CommentsDAO = require('../dao/comment-dao');
// const constant = require('../../../utils/constants');

// const _ = require('lodash');

module.exports = {
  async handleGet(req, res, next) {
    let response;
    try {
      response = await CommentsDAO.randomOne(req.user);
      return res.status(200).json(response);
    } catch (error) {
      logger.error(`Comments Controller::handleGet ${error}`);
      logger.debug(error);
      return next(error);
    }
  },
};
