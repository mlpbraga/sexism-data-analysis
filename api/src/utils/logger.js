const pino = require('pino');
const config = require('config');

const level = config.get('log');

module.exports = pino({
  level,
});
