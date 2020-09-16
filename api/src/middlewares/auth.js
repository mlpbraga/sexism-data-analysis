// // require('dotenv-safe').load();
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const logger = require('../utils/logger');
const Token = require('../services/jwtoken');
const { throwBadRequest } = require('../utils/errors/bad-request');
const { basicAuth } = require('../../config/');
const { models } = require('../models');

const { Users } = models;

const authValidation = {
  async login(req, res) {
    const {
      email,
      username,
      password,
    } = req.body;

    let user;

    if (username) {
      user = await Users.findOne({ where: { username } });
    } else if (email) {
      user = await Users.findOne({ where: { email } });
    } else {
      throwBadRequest({
        message: 'Invalid email or username',
        code: 401,
      });
      return res.status(401);
    }

    if (_.isEmpty(user)) {
      throwBadRequest({
        message: 'Invalid email or username',
        code: 401,
      });
      return res.status(401);
    }
    if (
      bcrypt.compareSync(password, user.password)) {
      const payload = {
        iat: new Date().valueOf(),
        sub: user.username.toString(),
        username: user.username.toString(),
        email: user.email.toString(),
      };
      return Token.generate(payload, {});
    }
    throwBadRequest({
      message: 'Invalid password',
      code: 401,
    });
    return res.status(401);
  },
  async check(req, res, next) {
    const { authorization } = req.headers;
    try {
      if (_.isEmpty(authorization)) {
        throwBadRequest({
          code: 401,
          message: 'Missing Token',
        });
      }
      req.user = await Token.verify(authorization);
      if (_.isEmpty(req.user)) {
        throwBadRequest({
          code: 401,
          message: 'Invalid Token',
        });
        res.status(401);
      }
      return next();
    } catch (error) {
      logger.error(`AuthMiddleware :: check ${error}`);
      logger.debug(error);
      return next(error);
    }
  },
  async basicAuthentication(req, res, next) {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    // eslint-disable-next-line no-buffer-constructor
    const [login, password] = Buffer.from(b64auth, 'base64')
      .toString().split(':');

    if (
      login
      && password
      && login === basicAuth.login
      && password === basicAuth.password
    ) {
      return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401);
    return res.json({
      code: 401,
      message: 'Missing Authorization Token',
    });
  },
};

module.exports = authValidation;
