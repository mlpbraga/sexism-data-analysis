const op = require('sequelize').Op;
const logger = require('../utils/logger');
const { models } = require('../models');

const { throwBadRequest } = require('../utils/errors/bad-request');

const { Users } = models;

const UserDao = {
  async query(reqParams) {
    const {
      id,
      q,
      deleted,
    } = reqParams;

    let where;
    let response = {};

    if (deleted) {
      where = {};
    } else {
      where = { deleted: false };
    }

    if (q) {
      where[op.or] = [
        { name: { [op.like]: `%${q}%` } },
        { username: { [op.like]: `%${id}%` } },
      ];
      response = await Users.findAll({ where });
    } else if (id) {
      where.username = { [op.like]: `%${id}%` };
      response = await Users.findOne({ where });
    } else {
      response = await Users.findAll({ where });
    }

    return response;
  },
  async create(reqParams) {
    let response;
    try {
      response = await Users.create(reqParams);
    } catch (error) {
      logger.error(`UserDao :: ${error}`);
      logger.debug(error);
      return throwBadRequest({
        code: 405,
        message: 'Could not create user',
      });
    }
    return response;
  },
  async update(reqParams) {
    const { email, username } = reqParams;

    const response = await Users.update(
      reqParams,
      {
        where: {
          [op.or]: [
            { email: email || '' },
            { username: username || '' }],
        },
        returning: true,
        plain: true,
      },
    );

    return response;
  },
  async delete(reqParams) {
    const { id } = reqParams;

    const response = await Users.destroy(
      {
        where: { username: id },
      },
    );
    return response;
  },
};

module.exports = UserDao;
