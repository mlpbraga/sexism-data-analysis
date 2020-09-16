const jwt = require('jsonwebtoken');
const fs = require('fs');
const _ = require('lodash');

const privateKEY = fs.readFileSync(
  `${process.cwd()}/config/keys/private.key`, 'utf8',
);

const { jwtConfig } = require('../../config');


const Token = {
  generate(payload, signOptions) {
    payload.iss = jwtConfig.issuer;
    payload.exp = payload.iat + jwtConfig.buyerLifetimeSeconds;
    payload.algorithm = jwtConfig.algorithm;

    signOptions.audience = payload.iss;

    const token = jwt.sign(payload, privateKEY, signOptions);

    return {
      expiresIn: jwtConfig.buyerLifetimeSeconds,
      token,
    };
  },

  async verify(token) {
    const legit = await jwt.verify(_.replace(token, 'Bearer ', ''), privateKEY);
    return legit;
  },
};

module.exports = Token;
