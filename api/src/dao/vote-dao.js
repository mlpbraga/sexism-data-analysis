const { models } = require('../models');
const logger = require('../utils/logger');
const { throwBadRequest } = require('../utils/errors/bad-request');

const { Votes } = models;

const VotesDao = {
  async add(reqParams) {
    let response;
    try {
      response = await Votes.create(reqParams);
      // response = true;
    } catch (error) {
      logger.error(`VotesDao :: ${error}`);
      logger.debug(error);
      return throwBadRequest({
        code: 405,
        message: 'Could not create vote',
      });
    }
    return response;
  },
};

module.exports = VotesDao;
