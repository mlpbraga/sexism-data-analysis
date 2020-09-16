const config = require('config');

const dbConfig = config.get('database');
const jwtConfig = config.get('jwt');
const basicAuth = config.get('basicAuth');

module.exports = {
  dbConfig,
  jwtConfig,
  basicAuth,
};
