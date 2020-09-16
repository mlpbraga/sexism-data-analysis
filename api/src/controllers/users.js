const logger = require('../utils/logger');
const UsersRequestFormatter = require(
  '../formatters/request/users',
);
const UsersDAO = require('../dao/user-dao');
// const constant = require('../../../utils/constants');

// const _ = require('lodash');

module.exports = {
  async handlePost(req, res, next) {
    let response;
    try {
      const reqParams = UsersRequestFormatter.format(req);
      response = await UsersDAO.create(reqParams);
      return res.status(201).json(response);
    } catch (error) {
      logger.error(`Users Controller::handlePost ${error}`);
      logger.debug(error);
      return next(error);
    }
  },

  async handlePut(req, res, next) {
    let response;
    try {
      const reqParams = UsersRequestFormatter.format(req);
      response = await UsersDAO.update(reqParams);
      return res.status(202).json(response);
    } catch (error) {
      logger.error(`Users Controller::handlePut ${error}`);
      logger.debug(error);
      return next(error);
    }
  },

  async handleDelete(req, res, next) {
    let response;
    try {
      const reqParams = UsersRequestFormatter.format(req);
      response = await UsersDAO.delete(reqParams);
      return res.status(201).json(response);
    } catch (error) {
      logger.error(`Users Controller::handleDelete ${error}`);
      logger.debug(error);
      return next(error);
    }
  },

  async handleGet(req, res, next) {
    let response;
    try {
      const reqParams = UsersRequestFormatter.format(req);
      response = await UsersDAO.query(reqParams);
      return res.status(200).json(response);
    } catch (error) {
      logger.error(`Users Controller::handleGet ${error}`);
      logger.debug(error);
      return next(error);
    }
  },
};
